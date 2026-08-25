"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./DivergentUniverse.module.css";

type NodeKind = "bubble" | "island" | "star";

type RetainedNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  parentId: string | null;
  kind: NodeKind;
};

type CandidateNode = RetainedNode;

type Camera = { x: number; y: number; scale: number };
type DraftRoot = { x: number; y: number; value: string };
type Point = { x: number; y: number };

const NODE_KINDS: NodeKind[] = ["bubble", "island", "star"];
const ORBIT_RADII = [136, 148, 160, 174, 188];
const EXPANDED_ORBIT_RADII = [206, 228, 252, 280];
const MIN_NODE_DISTANCE = 108;

const hashText = (value: string) => Array.from(value).reduce((sum, char) => sum + char.charCodeAt(0), 0);
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function lineStyle(from: RetainedNode, to: RetainedNode, fromRadius: number, toRadius: number) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.max(1, Math.hypot(dx, dy));
  const visibleLength = Math.max(8, length - fromRadius - toRadius);
  const unitX = dx / length;
  const unitY = dy / length;
  return {
    left: `${from.x + unitX * fromRadius}px`,
    top: `${from.y + unitY * fromRadius}px`,
    width: `${visibleLength}px`,
    transform: `rotate(${Math.atan2(dy, dx)}rad)`,
  } as CSSProperties;
}

function pointStyle(node: Point) {
  return { left: `${node.x}px`, top: `${node.y}px` } as CSSProperties;
}

function makeOrbit(
  labels: string[],
  active: RetainedNode,
  occupied: Array<RetainedNode | CandidateNode>,
  version: number,
) {
  const wanted = clamp(labels.length, 4, 6);
  const rotation = ((hashText(active.id) + version * 37) % 72) - 36;
  const placed: CandidateNode[] = [];
  const obstacles = occupied.filter((node) => node.id !== active.id);

  for (let index = 0; index < wanted; index += 1) {
    const ideal = rotation - 90 + (360 / wanted) * index;
    let chosen: Point | null = null;

    for (const radius of ORBIT_RADII) {
      for (const nudge of [0, 13, -13, 26, -26, 39, -39]) {
        const angle = ((ideal + nudge) * Math.PI) / 180;
        const point = {
          x: active.x + Math.cos(angle) * radius,
          y: active.y + Math.sin(angle) * radius,
        };
        const isOpen = [...obstacles, ...placed].every((node) => distance(point, node) >= MIN_NODE_DISTANCE);
        if (isOpen) {
          chosen = point;
          break;
        }
      }
      if (chosen) break;
    }

    if (!chosen && index >= 4) break;
    if (!chosen) {
      for (const radius of EXPANDED_ORBIT_RADII) {
        for (const nudge of [0, 17, -17, 34, -34, 51, -51]) {
          const angle = ((ideal + nudge) * Math.PI) / 180;
          const point = {
            x: active.x + Math.cos(angle) * radius,
            y: active.y + Math.sin(angle) * radius,
          };
          const isOpen = [...obstacles, ...placed].every((node) => distance(point, node) >= MIN_NODE_DISTANCE);
          if (isOpen) {
            chosen = point;
            break;
          }
        }
        if (chosen) break;
      }
    }

    if (!chosen) {
      const angle = ((ideal + index * 17) * Math.PI) / 180;
      const radius = 196 + index * 8;
      chosen = { x: active.x + Math.cos(angle) * radius, y: active.y + Math.sin(angle) * radius };
    }

    placed.push({
      id: `candidate-${version}-${index}-${labels[index]}`,
      label: labels[index],
      x: chosen.x,
      y: chosen.y,
      parentId: active.id,
      kind: NODE_KINDS[index % NODE_KINDS.length],
    });
  }

  return placed;
}

export function DivergentUniverse() {
  const [seed, setSeed] = useState("");
  const [retained, setRetained] = useState<RetainedNode[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [candidates, setCandidates] = useState<CandidateNode[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const [status, setStatus] = useState("点进中心气泡，写下第一个念头。 / Begin inside the centre.");
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, scale: 1 });
  const [draftRoot, setDraftRoot] = useState<DraftRoot | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [sliceLine, setSliceLine] = useState<{ start: Point; end: Point } | null>(null);

  const requestVersion = useRef(0);
  const latestRequests = useRef(new Map<string, number>());
  const nodeSequence = useRef(0);
  const stageRef = useRef<HTMLElement | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<null | { distance: number; midpoint: Point; camera: Camera }>(null);
  const gestureOccurred = useRef(false);
  const blankPress = useRef<null | { pointerId: number; start: Point }>(null);
  const lastBlankTap = useRef<null | { time: number; point: Point }>(null);
  const slash = useRef<null | { pointerId: number; start: Point; last: Point; moved: boolean }>(null);
  const suppressNextClick = useRef(false);
  const longPress = useRef<null | {
    id: string;
    pointerId: number;
    start: Point;
    timer: number;
    fired: boolean;
  }>(null);
  const nodeClickTimer = useRef<number | null>(null);
  const lastNodeClick = useRef<null | { id: string; time: number }>(null);
  const editingCommit = useRef(false);
  const draftCommit = useRef(false);

  const active = retained.find((node) => node.id === activeId) ?? null;
  const zoom = Math.max(0.66, 1 - Math.max(0, retained.length - 8) * 0.016);
  const viewportStyle = {
    "--universe-zoom": zoom * camera.scale,
    "--universe-mobile-zoom": Math.max(0.56, zoom * 0.84 * camera.scale),
    "--camera-x": `${camera.x}px`,
    "--camera-y": `${camera.y}px`,
  } as CSSProperties;
  const worldStyle = {
    transform: `translate(${-1 * (active?.x ?? 0)}px, ${-1 * (active?.y ?? 0)}px)`,
  } as CSSProperties;

  const retainedById = useMemo(
    () => new Map(retained.map((node) => [node.id, node])),
    [retained],
  );

  const generate = async (
    nextActive: RetainedNode,
    universe: RetainedNode[],
    extraAvoid: string[] = [],
    mode: "append" | "replace-parent" = "replace-parent",
    reserved: CandidateNode[] = [],
  ) => {
    const version = ++requestVersion.current;
    latestRequests.current.set(nextActive.id, version);
    setPendingIds((current) => new Set(current).add(nextActive.id));
    if (mode === "replace-parent") {
      setCandidates((current) => current.filter((node) => node.parentId !== nextActive.id));
    }
    setStatus(`正在从「${nextActive.label}」听下一圈航线……`);

    try {
      const avoid = [...universe.map((node) => node.label), ...extraAvoid];
      const response = await fetch("/api/divergent-universe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ center: nextActive.label, avoid: avoid.slice(-80) }),
      });
      const data = await response.json() as { nodes?: string[]; error?: string };
      if (!response.ok || !data.nodes?.length) throw new Error(data.error || "No nodes returned");
      if (latestRequests.current.get(nextActive.id) !== version) return;

      setCandidates((current) => {
        const base = mode === "replace-parent"
          ? current.filter((node) => node.parentId !== nextActive.id)
          : current;
        const labels = data.nodes.filter((label) => !base.some((node) => node.label === label));
        return [...base, ...makeOrbit(labels, nextActive, [...universe, ...base, ...reserved], version)];
      });
      setStatus("点一个继续生长 · 划过候选让它融掉 · 长按编辑 · 双击空白新建");
    } catch {
      if (latestRequests.current.get(nextActive.id) !== version) return;
      setStatus("这一圈暂时没有出现。双击中心，再听一次潮汐。");
    } finally {
      if (latestRequests.current.get(nextActive.id) === version) {
        setPendingIds((current) => {
          const next = new Set(current);
          next.delete(nextActive.id);
          return next;
        });
      }
    }
  };

  const start = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const label = seed.trim();
    if (!label) return;
    const root: RetainedNode = {
      id: `root-${++nodeSequence.current}`,
      label,
      x: 0,
      y: 0,
      parentId: null,
      kind: "bubble",
    };
    setRetained([root]);
    setActiveId(root.id);
    setSeed("");
    void generate(root, [root]);
  };

  const keepAndBranch = (candidate: CandidateNode) => {
    if (gestureOccurred.current || suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }
    const kept: RetainedNode = {
      ...candidate,
      id: `kept-${++nodeSequence.current}-${candidate.id}`,
    };
    const nextUniverse = [...retained, kept];
    const remaining = candidates.filter((node) => node.id !== candidate.id);
    setCandidates(remaining);
    setRetained(nextUniverse);
    setActiveId(kept.id);
    setCamera((current) => ({ ...current, x: 0, y: 0 }));
    setStatus(`「${kept.label}」已经留下，正在长出新的关联。`);
    void generate(kept, nextUniverse, remaining.map((node) => node.label), "append", remaining);
  };

  const focusRetained = (node: RetainedNode) => {
    setActiveId(node.id);
    setCamera((current) => ({ ...current, x: 0, y: 0 }));
    void generate(node, retained, candidates.map((candidate) => candidate.label), "replace-parent", candidates);
  };

  const regenerate = (node: RetainedNode) => {
    void generate(node, retained, candidates.map((candidate) => candidate.label), "replace-parent", candidates);
  };

  const handleRetainedClick = (node: RetainedNode, event: MouseEvent) => {
    if (editingId === node.id) return;
    if (gestureOccurred.current || suppressNextClick.current) {
      suppressNextClick.current = false;
      return;
    }
    if (event.detail === 0) {
      focusRetained(node);
      return;
    }
    const now = event.timeStamp;
    const previous = lastNodeClick.current;
    if (previous?.id === node.id && now - previous.time < 360 && node.id === activeId) {
      if (nodeClickTimer.current) window.clearTimeout(nodeClickTimer.current);
      nodeClickTimer.current = null;
      lastNodeClick.current = null;
      regenerate(node);
      return;
    }
    lastNodeClick.current = { id: node.id, time: now };
    if (nodeClickTimer.current) window.clearTimeout(nodeClickTimer.current);
    nodeClickTimer.current = window.setTimeout(() => {
      focusRetained(node);
      nodeClickTimer.current = null;
    }, 280);
  };

  const beginEdit = (node: RetainedNode) => {
    editingCommit.current = false;
    setEditingId(node.id);
    setEditValue(node.label);
    setCandidates((current) => current.filter((candidate) => candidate.parentId !== node.id));
    setStatus("直接在气泡里修改，按回车保存。旧的航线会留下。 ");
  };

  const commitEdit = (nodeId: string) => {
    if (editingCommit.current) return;
    editingCommit.current = true;
    const label = editValue.trim();
    const original = retained.find((node) => node.id === nodeId);
    if (!original) return;
    setEditingId(null);
    if (!label || label === original.label) return;
    const updated = { ...original, label };
    const nextUniverse = retained.map((node) => node.id === nodeId ? updated : node);
    setRetained(nextUniverse);
    setActiveId(updated.id);
    setCandidates((current) => current.filter((candidate) => candidate.parentId !== nodeId));
    void generate(updated, nextUniverse, candidates.map((candidate) => candidate.label), "replace-parent", candidates);
  };

  const handleRetainedKey = (event: KeyboardEvent<HTMLDivElement>, node: RetainedNode) => {
    if (editingId === node.id) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      focusRetained(node);
    }
    if (event.key === "F2") {
      event.preventDefault();
      beginEdit(node);
    }
    if (event.key.toLowerCase() === "r" && node.id === activeId) {
      event.preventDefault();
      regenerate(node);
    }
  };

  const startLongPress = (event: PointerEvent<HTMLDivElement>, node: RetainedNode) => {
    if (editingId || event.button !== 0) return;
    const start = { x: event.clientX, y: event.clientY };
    const timer = window.setTimeout(() => {
      if (longPress.current?.id !== node.id) return;
      longPress.current.fired = true;
      suppressNextClick.current = true;
      beginEdit(node);
    }, 560);
    longPress.current = { id: node.id, pointerId: event.pointerId, start, timer, fired: false };
  };

  const moveLongPress = (event: PointerEvent<HTMLDivElement>) => {
    const current = longPress.current;
    if (!current || current.pointerId !== event.pointerId) return;
    if (distance(current.start, { x: event.clientX, y: event.clientY }) > 9 || pointers.current.size > 1) {
      window.clearTimeout(current.timer);
      longPress.current = null;
    }
  };

  const endLongPress = (event: PointerEvent<HTMLDivElement>) => {
    const current = longPress.current;
    if (!current || current.pointerId !== event.pointerId) return;
    window.clearTimeout(current.timer);
    if (current.fired) suppressNextClick.current = true;
    longPress.current = null;
  };

  const dissolveAt = (clientX: number, clientY: number) => {
    const hit = document.elementsFromPoint(clientX, clientY)
      .map((element) => (element as HTMLElement).closest<HTMLElement>("[data-candidate-id]"))
      .find(Boolean);
    const id = hit?.dataset.candidateId;
    if (!id) return;
    setCandidates((current) => current.filter((node) => node.id !== id));
  };

  const worldPointFromClient = (point: Point) => {
    const stage = stageRef.current;
    if (!stage) return { x: active?.x ?? 0, y: active?.y ?? 0 };
    const rect = stage.getBoundingClientRect();
    const baseZoom = rect.width <= 780 ? Math.max(0.56, zoom * 0.84 * camera.scale) : zoom * camera.scale;
    const centreY = rect.top + rect.height * (rect.width <= 780 ? .49 : .53);
    return {
      x: (active?.x ?? 0) + (point.x - (rect.left + rect.width / 2) - camera.x) / baseZoom,
      y: (active?.y ?? 0) + (point.y - centreY - camera.y) / baseZoom,
    };
  };

  const openIndependentDraft = (clientPoint: Point) => {
    const intended = worldPointFromClient(clientPoint);
    let position = intended;
    if (retained.some((node) => distance(node, intended) < 100)) {
      const angle = ((hashText(`${intended.x}-${intended.y}`) % 360) * Math.PI) / 180;
      position = { x: intended.x + Math.cos(angle) * 118, y: intended.y + Math.sin(angle) * 118 };
    }
    setCandidates([]);
    draftCommit.current = false;
    setDraftRoot({ ...position, value: "" });
    setStatus("写下一个与原宇宙无关的新念头。它会成为新的独立起点。");
  };

  const commitDraftRoot = () => {
    if (draftCommit.current) return;
    draftCommit.current = true;
    if (!draftRoot) return;
    const label = draftRoot.value.trim();
    if (!label) {
      setDraftRoot(null);
      return;
    }
    const root: RetainedNode = {
      id: `root-${++nodeSequence.current}`,
      label,
      x: draftRoot.x,
      y: draftRoot.y,
      parentId: null,
      kind: "bubble",
    };
    const nextUniverse = [...retained, root];
    setRetained(nextUniverse);
    setActiveId(root.id);
    setDraftRoot(null);
    setCamera((current) => ({ ...current, x: 0, y: 0 }));
    void generate(root, nextUniverse, [], "append");
  };

  const isBlankTarget = (target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    return !element?.closest("[data-node], input, a, form");
  };

  const handleStagePointerDown = (event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY };
    if (event.pointerType === "touch") {
      pointers.current.set(event.pointerId, point);
      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        gesture.current = {
          distance: Math.max(1, distance(a, b)),
          midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
          camera,
        };
        gestureOccurred.current = true;
        suppressNextClick.current = true;
        if (longPress.current) window.clearTimeout(longPress.current.timer);
        longPress.current = null;
      }
    }

    const candidate = (event.target as HTMLElement).closest<HTMLElement>("[data-candidate-id]");
    if (candidate) slash.current = { pointerId: event.pointerId, start: point, last: point, moved: false };
    if (isBlankTarget(event.target)) blankPress.current = { pointerId: event.pointerId, start: point };
  };

  const handleStagePointerMove = (event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY };
    if (event.pointerType === "touch" && pointers.current.has(event.pointerId)) {
      pointers.current.set(event.pointerId, point);
      if (pointers.current.size >= 2 && gesture.current) {
        const [a, b] = [...pointers.current.values()];
        const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        const ratio = distance(a, b) / gesture.current.distance;
        setCamera({
          x: gesture.current.camera.x + midpoint.x - gesture.current.midpoint.x,
          y: gesture.current.camera.y + midpoint.y - gesture.current.midpoint.y,
          scale: clamp(gesture.current.camera.scale * ratio, .68, 1.8),
        });
        return;
      }
    }

    const currentSlash = slash.current;
    if (!currentSlash || currentSlash.pointerId !== event.pointerId || pointers.current.size > 1) return;
    const travelled = distance(currentSlash.start, point);
    if (travelled > 22) {
      currentSlash.moved = true;
      suppressNextClick.current = true;
      dissolveAt(point.x, point.y);
      const stageRect = stageRef.current?.getBoundingClientRect();
      if (stageRect) {
        setSliceLine({
          start: { x: currentSlash.last.x - stageRect.left, y: currentSlash.last.y - stageRect.top },
          end: { x: point.x - stageRect.left, y: point.y - stageRect.top },
        });
      }
    }
    currentSlash.last = point;
  };

  const handleStagePointerUp = (event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY };
    const currentSlash = slash.current;
    if (currentSlash?.pointerId === event.pointerId) {
      if (currentSlash.moved) window.setTimeout(() => setSliceLine(null), 170);
      slash.current = null;
    }

    const blank = blankPress.current;
    const wasGesture = gestureOccurred.current;
    if (event.type === "pointerup" && blank?.pointerId === event.pointerId && !wasGesture && distance(blank.start, point) < 9 && isBlankTarget(event.target)) {
      const now = event.timeStamp;
      const previous = lastBlankTap.current;
      if (previous && now - previous.time < 430 && distance(previous.point, point) < 34) {
        lastBlankTap.current = null;
        openIndependentDraft(point);
      } else {
        lastBlankTap.current = { time: now, point };
      }
    }
    if (blank?.pointerId === event.pointerId) blankPress.current = null;

    if (event.pointerType === "touch") {
      pointers.current.delete(event.pointerId);
      if (pointers.current.size < 2) gesture.current = null;
      if (pointers.current.size === 0) window.setTimeout(() => { gestureOccurred.current = false; }, 0);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.paperNoise} aria-hidden="true" />
      <header className={styles.atlasHeader}>
        <span>DUODUO OS · LIVE TOOL 05</span>
        <h1>DIVERGENT UNIVERSE <b>发散宇宙</b></h1>
        <p>留下想要的，让宇宙在每一次触碰里变大。</p>
      </header>
      <a className={styles.backLink} href="/ai#take">↙ DUODUO OS / TAKE SOMETHING</a>

      <section
        ref={stageRef}
        className={styles.stage}
        aria-label="发散宇宙交互画布"
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerUp}
      >
        <div className={styles.navigationStars} aria-hidden="true">
          <span>✦</span><i>·</i><i>·</i><span>✧</span><i>·</i><span>✦</span>
        </div>

        {sliceLine && (
          <svg className={styles.sliceTrace} aria-hidden="true">
            <line x1={sliceLine.start.x} y1={sliceLine.start.y} x2={sliceLine.end.x} y2={sliceLine.end.y} />
          </svg>
        )}

        {!active ? (
          <motion.div className={styles.seedCenter} data-node initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}>
            <form onSubmit={start} className={styles.seedForm}>
              <label htmlFor="universe-seed">此刻，你想从什么开始？</label>
              <input
                id="universe-seed"
                autoFocus
                value={seed}
                maxLength={36}
                onChange={(event) => setSeed(event.target.value)}
                placeholder="写在气泡里"
                autoComplete="off"
              />
              <small>PRESS ENTER · 按下回车</small>
            </form>
          </motion.div>
        ) : (
          <div className={styles.universeViewport} style={viewportStyle}>
            <motion.div className={styles.universeWorld} style={worldStyle} animate={{ opacity: 1 }}>
              <div className={styles.connections} aria-hidden="true">
                {retained.map((node) => {
                  const parent = node.parentId ? retainedById.get(node.parentId) : null;
                  if (!parent) return null;
                  return (
                    <span
                      className={styles.keptThread}
                      key={`line-${node.id}`}
                      style={lineStyle(parent, node, parent.id === activeId ? 80 : 45, node.id === activeId ? 80 : 45)}
                    />
                  );
                })}
                {candidates.map((node) => {
                  const parent = node.parentId ? retainedById.get(node.parentId) : null;
                  return parent ? (
                    <motion.span
                      className={styles.candidateThread}
                      key={`candidate-line-${node.id}`}
                      style={lineStyle(parent, node, parent.id === activeId ? 80 : 45, 51)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  ) : null;
                })}
              </div>

              {retained.map((node) => {
                const isActive = node.id === active.id;
                const isEditing = editingId === node.id;
                return (
                  <motion.div
                    key={node.id}
                    data-node
                    data-retained-id={node.id}
                    role="button"
                    tabIndex={0}
                    className={`${styles.node} ${styles.keptNode} ${styles[node.kind]} ${isActive ? styles.isActive : ""} ${isEditing ? styles.isEditing : ""}`}
                    style={pointStyle(node)}
                    onClick={(event) => handleRetainedClick(node, event)}
                    onKeyDown={(event) => handleRetainedKey(event, node)}
                    onPointerDown={(event) => startLongPress(event, node)}
                    onPointerMove={moveLongPress}
                    onPointerUp={endLongPress}
                    onPointerCancel={endLongPress}
                    onContextMenu={(event) => event.preventDefault()}
                    aria-label={`${node.label}${isActive ? "，当前中心；双击换一批，长按编辑" : "，已留下；点击继续发散，长按编辑"}`}
                    layout
                  >
                    {isEditing ? (
                      <form
                        className={styles.nodeEditForm}
                        onSubmit={(event) => { event.preventDefault(); commitEdit(node.id); }}
                        onPointerDown={(event) => event.stopPropagation()}
                      >
                        <input
                          autoFocus
                          value={editValue}
                          maxLength={36}
                          aria-label={`编辑${node.label}`}
                          onChange={(event) => setEditValue(event.target.value)}
                          onBlur={() => commitEdit(node.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Escape") {
                              event.preventDefault();
                              editingCommit.current = true;
                              setEditingId(null);
                            }
                          }}
                        />
                        <small>ENTER · 保存</small>
                      </form>
                    ) : (
                      <>
                        <small>{isActive ? (pendingIds.has(node.id) ? "LISTENING" : "CURRENT CENTRE") : "KEPT"}</small>
                        <strong>{node.label}</strong>
                        <i aria-hidden="true">✦</i>
                      </>
                    )}
                  </motion.div>
                );
              })}

              <AnimatePresence>
                {candidates.map((node, index) => (
                  <motion.button
                    type="button"
                    key={node.id}
                    data-node
                    data-candidate-id={node.id}
                    className={`${styles.node} ${styles.candidateNode} ${styles[node.kind]}`}
                    style={{ ...pointStyle(node), "--node-delay": `${index * 34}ms` } as CSSProperties}
                    onClick={() => keepAndBranch(node)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" || event.key === "Delete") {
                        event.preventDefault();
                        setCandidates((current) => current.filter((candidate) => candidate.id !== node.id));
                      }
                    }}
                    aria-label={`留下“${node.label}”并从它继续发散；也可以划过它让它融掉`}
                    initial={{ opacity: 0, scale: .72 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: .42, filter: "blur(9px)" }}
                    transition={{ duration: .42, delay: index * .034, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <strong>{node.label}</strong>
                    <i aria-hidden="true">✦</i>
                  </motion.button>
                ))}
              </AnimatePresence>

              {draftRoot && (
                <motion.div
                  className={`${styles.node} ${styles.draftNode} ${styles.bubble}`}
                  style={pointStyle(draftRoot)}
                  data-node
                  initial={{ opacity: 0, scale: .7 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <form
                    className={styles.nodeEditForm}
                    onSubmit={(event) => { event.preventDefault(); commitDraftRoot(); }}
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    <label htmlFor="independent-root">新的起点</label>
                    <input
                      id="independent-root"
                      autoFocus
                      value={draftRoot.value}
                      maxLength={36}
                      placeholder="写在这里"
                      onChange={(event) => setDraftRoot((current) => current ? { ...current, value: event.target.value } : null)}
                      onBlur={commitDraftRoot}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          event.preventDefault();
                          draftCommit.current = true;
                          setDraftRoot(null);
                        }
                      }}
                    />
                    <small>ENTER · 生长</small>
                  </form>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}

        <p className={styles.status} role="status" aria-live="polite">{status}</p>
      </section>
    </main>
  );
}

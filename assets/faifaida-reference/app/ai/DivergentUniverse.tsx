"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./DivergentUniverse.module.css";

type NodeKind = "bubble" | "island" | "star";
type Point = { x: number; y: number };
type Camera = { x: number; y: number; scale: number };
type UniverseNode = Point & { id: string; label: string; parentId: string | null; kind: NodeKind };
type OrganizationCluster = { title: string; nodeIds: string[]; insight: string };
type UniversePage = { id: string; kind: "universe"; title: string; retained: UniverseNode[]; candidates: UniverseNode[]; activeId: string | null; camera: Camera; organizedAt: number };
type OrganizationPage = { id: string; kind: "organization"; title: string; sourcePageId: string; sourceNodeCount: number; nodes: UniverseNode[]; summary: string; clusters: OrganizationCluster[]; newInsights: string[]; createdAt: number };
type Page = UniversePage | OrganizationPage;
type Workspace = { version: 2; anonymousId: string; activePageId: string; pages: Page[] };
type DraftRoot = Point & { value: string };
type ChatMessage = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "duoduo-divergent-workspace-v2";
const NODE_KINDS: NodeKind[] = ["bubble", "island", "star"];
const EMPTY_CAMERA: Camera = { x: 0, y: 0, scale: 1 };
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const timestamp = () => Date.now();
const nodeRadius = (node: UniverseNode, activeId?: string | null) => node.id === activeId ? 82 : node.kind === "star" ? 58 : 54;
const freshUniverse = (): UniversePage => ({ id: uid("universe"), kind: "universe", title: "新页面", retained: [], candidates: [], activeId: null, camera: EMPTY_CAMERA, organizedAt: 0 });
const freshWorkspace = (): Workspace => { const page = freshUniverse(); return { version: 2, anonymousId: uid("anon"), activePageId: page.id, pages: [page] }; };

function lineStyle(from: UniverseNode, to: UniverseNode, activeId: string | null) {
  const dx = to.x - from.x, dy = to.y - from.y, length = Math.max(1, Math.hypot(dx, dy));
  return { left: `${from.x + dx / length * nodeRadius(from, activeId)}px`, top: `${from.y + dy / length * nodeRadius(from, activeId)}px`, width: `${Math.max(7, length - nodeRadius(from, activeId) - nodeRadius(to, activeId))}px`, transform: `rotate(${Math.atan2(dy, dx)}rad)` } as CSSProperties;
}
function pointStyle(node: Point) { return { left: `${node.x}px`, top: `${node.y}px` } as CSSProperties; }

function makeOrbit(labels: string[], active: UniverseNode, occupied: UniverseNode[], version: number) {
  const placed: UniverseNode[] = [];
  const obstacles = occupied.filter((node) => node.id !== active.id);
  const rotation = ((Array.from(active.label).reduce((sum, char) => sum + char.charCodeAt(0), 0) + version * 47) % 360) * Math.PI / 180;
  labels.slice(0, 5).forEach((label, index) => {
    const kind = NODE_KINDS[index % NODE_KINDS.length], radiusOfNode = kind === "star" ? 58 : 54;
    const ideal = rotation + index * Math.PI * 2 / 5;
    let chosen: Point | null = null;
    for (let ring = 0; ring < 18 && !chosen; ring += 1) {
      const orbitRadius = 150 + ring * 24;
      for (let step = 0; step < 24; step += 1) {
        const direction = step === 0 ? 0 : Math.ceil(step / 2) * (step % 2 ? 1 : -1);
        const angle = ideal + direction * Math.PI / 24;
        const point = { x: active.x + Math.cos(angle) * orbitRadius, y: active.y + Math.sin(angle) * orbitRadius };
        if ([...obstacles, ...placed].every((node) => distance(point, node) >= radiusOfNode + nodeRadius(node) + 18)) { chosen = point; break; }
      }
    }
    const angle = ideal + index * .17;
    const point = chosen ?? { x: active.x + Math.cos(angle) * (570 + index * 30), y: active.y + Math.sin(angle) * (570 + index * 30) };
    placed.push({ id: uid(`candidate-${version}-${index}`), label, ...point, parentId: active.id, kind });
  });
  return placed;
}

function settlePage(page: UniversePage) {
  const retainedIds = new Set(page.retained.map((node) => node.id));
  const original = new Map([...page.retained, ...page.candidates].map((node) => [node.id, { x: node.x, y: node.y }]));
  const nodes = [...page.retained, ...page.candidates].map((node) => ({ ...node }));
  const byId = () => new Map(nodes.map((node) => [node.id, node]));
  for (let pass = 0; pass < 34; pass += 1) {
    const lookup = byId();
    for (let a = 0; a < nodes.length; a += 1) for (let b = a + 1; b < nodes.length; b += 1) {
      const left = nodes[a], right = nodes[b], dx = right.x - left.x || .01, dy = right.y - left.y || .01;
      const gap = Math.hypot(dx, dy), required = nodeRadius(left, page.activeId) + nodeRadius(right, page.activeId) + 24;
      if (gap >= required) continue;
      const push = (required - gap) * .52, ux = dx / gap, uy = dy / gap;
      const leftWeight = retainedIds.has(left.id) ? .12 : .55, rightWeight = retainedIds.has(right.id) ? .12 : .55;
      left.x -= ux * push * leftWeight; left.y -= uy * push * leftWeight;
      right.x += ux * push * rightWeight; right.y += uy * push * rightWeight;
    }
    for (const node of nodes) {
      const parent = node.parentId ? lookup.get(node.parentId) : null;
      if (parent) {
        const dx = node.x - parent.x, dy = node.y - parent.y, length = Math.max(1, Math.hypot(dx, dy));
        const target = retainedIds.has(node.id) ? 132 : 148, pull = (length - target) * (retainedIds.has(node.id) ? .012 : .035);
        node.x -= dx / length * pull; node.y -= dy / length * pull;
      }
      const start = original.get(node.id)!;
      const maxDrift = retainedIds.has(node.id) ? 24 : 180, drift = distance(node, start);
      if (drift > maxDrift) { node.x = start.x + (node.x - start.x) / drift * maxDrift; node.y = start.y + (node.y - start.y) / drift * maxDrift; }
    }
  }
  const positions = new Map(nodes.map((node) => [node.id, node]));
  return { ...page, retained: page.retained.map((node) => ({ ...node, ...positions.get(node.id) })), candidates: page.candidates.map((node) => ({ ...node, ...positions.get(node.id) })) };
}

function segmentDistance(point: Point, start: Point, end: Point) {
  const dx = end.x - start.x, dy = end.y - start.y, squared = dx * dx + dy * dy;
  if (!squared) return distance(point, start);
  const t = clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / squared, 0, 1);
  return distance(point, { x: start.x + t * dx, y: start.y + t * dy });
}
function validWorkspace(value: unknown): value is Workspace {
  const candidate = value as Partial<Workspace> | null;
  return !!candidate && candidate.version === 2 && typeof candidate.activePageId === "string" && Array.isArray(candidate.pages);
}

export function DivergentUniverse() {
  const [workspace, setWorkspace] = useState<Workspace>(() => freshWorkspace());
  const [hydrated, setHydrated] = useState(false);
  const [seed, setSeed] = useState("");
  const [status, setStatus] = useState("点进中心气泡，写下第一个念头。 / Begin inside the centre.");
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set());
  const [draftRoot, setDraftRoot] = useState<DraftRoot | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [sliceLine, setSliceLine] = useState<{ start: Point; end: Point } | null>(null);
  const [historyCount, setHistoryCount] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatDraft, setChatDraft] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatBusy, setChatBusy] = useState(false);
  const workspaceRef = useRef(workspace);
  const history = useRef<Workspace[]>([]);
  const stageRef = useRef<HTMLElement | null>(null);
  const requestVersion = useRef(0);
  const latestRequests = useRef(new Map<string, number>());
  const pointers = useRef(new Map<number, Point>());
  const pinch = useRef<null | { distance: number; midpoint: Point; camera: Camera }>(null);
  const stroke = useRef<null | { pointerId: number; start: Point; last: Point; startedAt: number; cutting: boolean; cutIds: Set<string> }>(null);
  const longPress = useRef<null | { id: string; pointerId: number; start: Point; timer: number; fired: boolean }>(null);
  const clickTimer = useRef<number | null>(null);
  const lastClick = useRef<null | { id: string; time: number; candidate: boolean }>(null);
  const lastBlankTap = useRef<null | { time: number; point: Point }>(null);
  const suppressClick = useRef(false);
  const organizing = useRef(new Set<string>());

  const activePage = workspace.pages.find((page) => page.id === workspace.activePageId) ?? workspace.pages[0];
  const universe = activePage?.kind === "universe" ? activePage : null;
  const organization = activePage?.kind === "organization" ? activePage : null;
  const active = universe?.retained.find((node) => node.id === universe.activeId) ?? null;
  const allNodes = universe ? [...universe.retained, ...universe.candidates] : [];
  const retainedById = useMemo(() => new Map((universe?.retained ?? []).map((node) => [node.id, node])), [universe?.retained]);
  const zoom = universe ? Math.max(.64, 1 - Math.max(0, universe.retained.length - 8) * .012) : 1;

  useEffect(() => { queueMicrotask(() => { try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const parsed: unknown = JSON.parse(saved); if (validWorkspace(parsed)) setWorkspace(parsed); } } catch { /* storage may be blocked */ } setHydrated(true); }); }, []);
  useEffect(() => { workspaceRef.current = workspace; }, [workspace]);
  useEffect(() => { if (!hydrated) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace)); } catch { /* keep live session */ } }, [hydrated, workspace]);

  const setWithoutHistory = (updater: (current: Workspace) => Workspace) => setWorkspace((current) => updater(current));
  const mutate = (updater: (current: Workspace) => Workspace) => setWorkspace((current) => { history.current = [...history.current.slice(-29), current]; setHistoryCount(history.current.length); return updater(current); });
  const updateUniverse = (current: Workspace, pageId: string, updater: (page: UniversePage) => UniversePage): Workspace => ({ ...current, pages: current.pages.map((page) => page.id === pageId && page.kind === "universe" ? updater(page) : page) });
  const undo = () => { const previous = history.current.pop(); if (!previous) return; setWorkspace(previous); setHistoryCount(history.current.length); setStatus("已经撤回上一步。 / UNDO"); };

  const generate = async (pageId: string, centreId: string, replace = true) => {
    const snapshot = workspaceRef.current.pages.find((page) => page.id === pageId);
    if (!snapshot || snapshot.kind !== "universe") return;
    const centre = snapshot.retained.find((node) => node.id === centreId);
    if (!centre) return;
    const version = ++requestVersion.current;
    latestRequests.current.set(centre.id, version);
    setPendingIds((current) => new Set(current).add(centre.id));
    if (replace) setWithoutHistory((current) => updateUniverse(current, pageId, (page) => ({ ...page, candidates: page.candidates.filter((node) => node.parentId !== centre.id) })));
    setStatus(`正在从「${centre.label}」听五条新航线……`);
    try {
      const live = workspaceRef.current.pages.find((page) => page.id === pageId);
      const avoid = live?.kind === "universe" ? [...live.retained, ...live.candidates].map((node) => node.label) : [];
      const response = await fetch("/api/divergent-universe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ center: centre.label, avoid: avoid.slice(-100) }) });
      const data = await response.json() as { nodes?: string[]; error?: string };
      if (!response.ok || data.nodes?.length !== 5) throw new Error(data.error || "Five nodes were not returned");
      if (latestRequests.current.get(centre.id) !== version) return;
      setWithoutHistory((current) => updateUniverse(current, pageId, (page) => {
        const base = replace ? page.candidates.filter((node) => node.parentId !== centre.id) : page.candidates;
        const labels = data.nodes!.filter((label) => ![...page.retained, ...base].some((node) => node.label === label));
        return settlePage({ ...page, candidates: [...base, ...makeOrbit(labels, centre, [...page.retained, ...base], version)] });
      }));
      setStatus("单击候选保留 · 双击气泡继续发散 · 快速划过删除 · 长按编辑");
    } catch { setStatus("这一圈暂时没有出现。双击中心，再听一次潮汐。"); }
    finally { setPendingIds((current) => { const next = new Set(current); next.delete(centre.id); return next; }); }
  };

  const start = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!universe || !seed.trim()) return;
    const root: UniverseNode = { id: uid("root"), label: seed.trim(), x: 0, y: 0, parentId: null, kind: "bubble" };
    mutate((current) => updateUniverse(current, universe.id, (page) => ({ ...page, title: root.label, retained: [root], candidates: [], activeId: root.id })));
    setSeed(""); window.setTimeout(() => void generate(universe.id, root.id), 0);
  };
  const retainCandidate = (pageId: string, candidateId: string) => {
    mutate((current) => updateUniverse(current, pageId, (page) => { const candidate = page.candidates.find((node) => node.id === candidateId); if (!candidate) return page; return settlePage({ ...page, retained: [...page.retained, { ...candidate, id: uid("kept") }], candidates: page.candidates.filter((node) => node.id !== candidateId) }); }));
    setStatus("已经留下。双击它，才会成为新中心并长出五个候选。");
  };
  const promoteCandidate = (pageId: string, candidateId: string) => {
    const page = workspaceRef.current.pages.find((item) => item.id === pageId);
    if (!page || page.kind !== "universe") return null;
    const candidate = page.candidates.find((node) => node.id === candidateId); if (!candidate) return null;
    const kept = { ...candidate, id: uid("kept") };
    mutate((current) => updateUniverse(current, pageId, (item) => ({ ...item, retained: [...item.retained, kept], candidates: item.candidates.filter((node) => node.id !== candidateId) })));
    return kept;
  };
  const centreAndGenerate = (pageId: string, nodeId: string, candidate: boolean) => {
    let centreId = nodeId;
    let siblingParentId: string | null = null;
    if (candidate) {
      const source = workspaceRef.current.pages.find((page) => page.id === pageId);
      siblingParentId = source?.kind === "universe" ? source.candidates.find((node) => node.id === nodeId)?.parentId ?? null : null;
      const kept = promoteCandidate(pageId, nodeId); if (!kept) return; centreId = kept.id;
    }
    setWithoutHistory((current) => updateUniverse(current, pageId, (page) => ({ ...page, activeId: centreId, candidates: candidate ? page.candidates.filter((node) => node.parentId !== siblingParentId) : page.candidates, camera: { ...page.camera, x: 0, y: 0 } })));
    window.setTimeout(() => void generate(pageId, centreId), 0);
  };
  const handleNodeClick = (node: UniverseNode, candidate: boolean, event: MouseEvent) => {
    if (!universe || editingId || suppressClick.current) { suppressClick.current = false; return; }
    if (event.detail === 0) { if (candidate) retainCandidate(universe.id, node.id); else centreAndGenerate(universe.id, node.id, false); return; }
    const now = event.timeStamp, previous = lastClick.current;
    if (previous?.id === node.id && previous.candidate === candidate && now - previous.time < 380) {
      if (clickTimer.current) window.clearTimeout(clickTimer.current); clickTimer.current = null; lastClick.current = null; centreAndGenerate(universe.id, node.id, candidate); return;
    }
    lastClick.current = { id: node.id, time: now, candidate };
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    clickTimer.current = window.setTimeout(() => { if (candidate) retainCandidate(universe.id, node.id); clickTimer.current = null; lastClick.current = null; }, 285);
  };

  const beginEdit = (node: UniverseNode, candidate: boolean) => {
    if (!universe) return;
    const editable = candidate ? promoteCandidate(universe.id, node.id) ?? node : node;
    setEditingId(editable.id); setEditValue(editable.label);
    setStatus(candidate ? "候选已自动留下。直接在气泡里修改，回车保存。" : "直接在气泡里修改，回车保存。旧航线仍会留下。");
  };
  const commitEdit = (nodeId: string) => { if (!universe) return; const label = editValue.trim(); setEditingId(null); if (!label) return; mutate((current) => updateUniverse(current, universe.id, (page) => ({ ...page, retained: page.retained.map((node) => node.id === nodeId ? { ...node, label } : node) }))); };
  const startLongPress = (event: PointerEvent<HTMLElement>, node: UniverseNode, candidate: boolean) => {
    if (event.button !== 0 || editingId) return;
    const startPoint = { x: event.clientX, y: event.clientY };
    const timer = window.setTimeout(() => { if (longPress.current?.id !== node.id) return; longPress.current.fired = true; suppressClick.current = true; beginEdit(node, candidate); }, 560);
    longPress.current = { id: node.id, pointerId: event.pointerId, start: startPoint, timer, fired: false };
  };
  const moveLongPress = (event: PointerEvent<HTMLElement>) => { const press = longPress.current; if (press && (press.pointerId !== event.pointerId || distance(press.start, { x: event.clientX, y: event.clientY }) > 10 || pointers.current.size > 1)) { window.clearTimeout(press.timer); longPress.current = null; } };
  const endLongPress = (event: PointerEvent<HTMLElement>) => { const press = longPress.current; if (!press || press.pointerId !== event.pointerId) return; window.clearTimeout(press.timer); if (press.fired) suppressClick.current = true; longPress.current = null; };

  const worldPointFromClient = (point: Point) => {
    const stage = stageRef.current; if (!stage || !universe) return { x: active?.x ?? 0, y: active?.y ?? 0 };
    const rect = stage.getBoundingClientRect(), scale = (rect.width <= 780 ? Math.max(.54, zoom * .83) : zoom) * universe.camera.scale;
    const centreY = rect.top + rect.height * (rect.width <= 780 ? .49 : .53);
    return { x: (active?.x ?? 0) + (point.x - rect.left - rect.width / 2 - universe.camera.x) / scale, y: (active?.y ?? 0) + (point.y - centreY - universe.camera.y) / scale };
  };
  const deleteAlongSegment = (startPoint: Point, endPoint: Point) => {
    if (!universe) return;
    const a = worldPointFromClient(startPoint), b = worldPointFromClient(endPoint);
    const alreadyCut = stroke.current?.cutIds ?? new Set<string>();
    const hitIds = allNodes.filter((node) => !alreadyCut.has(node.id) && segmentDistance(node, a, b) <= nodeRadius(node, universe.activeId) + 9).map((node) => node.id);
    if (!hitIds.length) return;
    hitIds.forEach((id) => stroke.current?.cutIds.add(id));
    mutate((current) => updateUniverse(current, universe.id, (page) => {
      const deleted = new Set(hitIds);
      const retained = page.retained.filter((node) => !deleted.has(node.id)).map((node) => node.parentId && deleted.has(node.parentId) ? { ...node, parentId: null } : node);
      const candidates = page.candidates.filter((node) => !deleted.has(node.id) && !(node.parentId && deleted.has(node.parentId)));
      return { ...page, retained, candidates, activeId: deleted.has(page.activeId ?? "") ? retained.at(-1)?.id ?? null : page.activeId };
    }));
    setStatus(`划掉了 ${hitIds.length} 个气泡。需要时可点撤回。`);
  };
  const openIndependentDraft = (clientPoint: Point) => {
    if (!universe) return; const intended = worldPointFromClient(clientPoint); let position = intended;
    for (let ring = 0; ring < 12 && allNodes.some((node) => distance(node, position) < nodeRadius(node) + 92); ring += 1) { const angle = ring * 2.4; position = { x: intended.x + Math.cos(angle) * (120 + ring * 22), y: intended.y + Math.sin(angle) * (120 + ring * 22) }; }
    setDraftRoot({ ...position, value: "" });
  };
  const commitDraftRoot = () => {
    if (!universe || !draftRoot?.value.trim()) { setDraftRoot(null); return; }
    const root: UniverseNode = { id: uid("root"), label: draftRoot.value.trim(), x: draftRoot.x, y: draftRoot.y, parentId: null, kind: "bubble" };
    mutate((current) => updateUniverse(current, universe.id, (page) => ({ ...page, retained: [...page.retained, root], activeId: root.id }))); setDraftRoot(null);
  };

  const isBlankTarget = (target: EventTarget | null) => !(target as HTMLElement | null)?.closest("[data-node], input, button, a, form");
  const handleStagePointerDown = (event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY }; pointers.current.set(event.pointerId, point);
    if (pointers.current.size === 2 && universe) {
      const [a, b] = [...pointers.current.values()]; pinch.current = { distance: Math.max(1, distance(a, b)), midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, camera: universe.camera }; suppressClick.current = true;
      if (longPress.current) window.clearTimeout(longPress.current.timer); longPress.current = null;
    } else if (pointers.current.size === 1) stroke.current = { pointerId: event.pointerId, start: point, last: point, startedAt: event.timeStamp, cutting: false, cutIds: new Set() };
  };
  const handleStagePointerMove = (event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY }; if (pointers.current.has(event.pointerId)) pointers.current.set(event.pointerId, point);
    if (pointers.current.size >= 2 && pinch.current && universe) {
      const [a, b] = [...pointers.current.values()], midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, ratio = distance(a, b) / pinch.current.distance;
      const camera = { x: pinch.current.camera.x + midpoint.x - pinch.current.midpoint.x, y: pinch.current.camera.y + midpoint.y - pinch.current.midpoint.y, scale: clamp(pinch.current.camera.scale * ratio, .58, 2) };
      setWithoutHistory((current) => updateUniverse(current, universe.id, (page) => ({ ...page, camera }))); return;
    }
    const current = stroke.current; if (!current || current.pointerId !== event.pointerId || pointers.current.size !== 1) return;
    moveLongPress(event);
    const travelled = distance(current.start, point), elapsed = Math.max(1, event.timeStamp - current.startedAt);
    if (travelled > 20 && travelled / elapsed > .16) {
      if (!current.cutting) { current.cutting = true; suppressClick.current = true; }
      deleteAlongSegment(current.last, point);
      const rect = stageRef.current?.getBoundingClientRect(); if (rect) setSliceLine({ start: { x: current.last.x - rect.left, y: current.last.y - rect.top }, end: { x: point.x - rect.left, y: point.y - rect.top } });
    }
    current.last = point;
  };
  const handleStagePointerUp = (event: PointerEvent<HTMLElement>) => {
    const point = { x: event.clientX, y: event.clientY }, current = stroke.current;
    const wasCutting = current?.pointerId === event.pointerId && current.cutting;
    if (wasCutting) window.setTimeout(() => setSliceLine(null), 170); if (current?.pointerId === event.pointerId) stroke.current = null; endLongPress(event);
    if (!wasCutting && pointers.current.size === 1 && isBlankTarget(event.target) && current && distance(current.start, point) < 10) {
      const previous = lastBlankTap.current, now = event.timeStamp;
      if (previous && now - previous.time < 430 && distance(previous.point, point) < 36) { lastBlankTap.current = null; openIndependentDraft(point); } else lastBlankTap.current = { time: now, point };
    }
    pointers.current.delete(event.pointerId); if (pointers.current.size < 2) pinch.current = null; if (pointers.current.size === 0) window.setTimeout(() => { suppressClick.current = false; }, 0);
  };

  const organizePage = async (source: UniversePage, automatic = false) => {
    if (organizing.current.has(source.id) || source.retained.length < 4) return;
    organizing.current.add(source.id); setStatus("AI 正在旁边整理一张快照，原宇宙不会被打乱……");
    try {
      const response = await fetch("/api/divergent-organize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: source.title, nodes: source.retained.map(({ id, label }) => ({ id, label })) }) });
      const data = await response.json() as { title: string; summary: string; clusters: OrganizationCluster[]; newInsights: string[] };
      if (!response.ok || !Array.isArray(data.clusters)) throw new Error("Organization failed");
      const page: OrganizationPage = { id: uid("organization"), kind: "organization", title: data.title || `${source.title} · 整理`, sourcePageId: source.id, sourceNodeCount: source.retained.length, nodes: source.retained, summary: data.summary, clusters: data.clusters, newInsights: data.newInsights ?? [], createdAt: timestamp() };
      mutate((current) => ({ ...current, activePageId: automatic ? current.activePageId : page.id, pages: [...current.pages, page].map((item) => item.id === source.id && item.kind === "universe" ? { ...item, organizedAt: source.retained.length } : item) }));
      setStatus(automatic ? "AI 已在底部生成整理快照，没有改变当前宇宙。" : "整理快照已经生成。");
    } catch { setStatus("整理暂时没有完成，原宇宙完全没有变化，可以稍后再试。"); } finally { organizing.current.delete(source.id); }
  };
  const createPage = () => { const page = freshUniverse(); mutate((current) => ({ ...current, activePageId: page.id, pages: [...current.pages, page] })); setSeed(""); setDraftRoot(null); setEditingId(null); };
  const switchPage = (pageId: string) => { mutate((current) => ({ ...current, activePageId: pageId })); setDraftRoot(null); setEditingId(null); };
  const jumpToSource = (sourcePageId: string, nodeId: string) => mutate((current) => ({ ...current, activePageId: sourcePageId, pages: current.pages.map((page) => page.id === sourcePageId && page.kind === "universe" ? { ...page, activeId: nodeId } : page) }));
  const copyCluster = (cluster: OrganizationCluster) => { if (!organization) return; const sourceNodes = cluster.nodeIds.map((id) => organization.nodes.find((node) => node.id === id)).filter(Boolean) as UniverseNode[]; if (!sourceNodes.length) return; const root = { ...sourceNodes[0], id: uid("root"), x: 0, y: 0, parentId: null }; const page: UniversePage = { ...freshUniverse(), title: cluster.title, retained: [root], activeId: root.id }; mutate((current) => ({ ...current, activePageId: page.id, pages: [...current.pages, page] })); };

  const refreshOrganization = async () => {
    if (!organization || organizing.current.has(organization.id)) return;
    const source = workspaceRef.current.pages.find((page) => page.id === organization.sourcePageId);
    if (!source || source.kind !== "universe" || source.retained.length < 4) return;
    organizing.current.add(organization.id); setStatus("正在补进最新留下的气泡……");
    try {
      const response = await fetch("/api/divergent-organize", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ title: source.title, nodes: source.retained.map(({ id, label }) => ({ id, label })) }) });
      const data = await response.json() as { title: string; summary: string; clusters: OrganizationCluster[]; newInsights: string[] };
      if (!response.ok || !Array.isArray(data.clusters)) throw new Error("Organization failed");
      mutate((current) => ({ ...current, pages: current.pages.map((page) => page.id === organization.id && page.kind === "organization" ? { ...page, title: data.title || page.title, sourceNodeCount: source.retained.length, nodes: source.retained, summary: data.summary, clusters: data.clusters, newInsights: data.newInsights ?? [], createdAt: timestamp() } : page) }));
      setStatus(`已补充到 ${source.retained.length} 个节点。`);
    } catch { setStatus("这次刷新没有完成，旧整理仍然保留。"); } finally { organizing.current.delete(organization.id); }
  };

  const sendChat = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const content = chatDraft.trim(); if (!content || chatBusy) return;
    const contextNodes = universe?.retained.map((node) => node.label) ?? organization?.nodes.map((node) => node.label) ?? [];
    const userMessage: ChatMessage = { role: "user", content };
    const contextMessage: ChatMessage = { role: "user", content: `当前发散宇宙：${contextNodes.slice(-60).join("、") || "尚无节点"}\n用户的问题：${content}` };
    const visible = [...chatMessages, userMessage]; setChatMessages(visible); setChatDraft(""); setChatBusy(true);
    try {
      const response = await fetch("/api/duoduo-ai", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: [...chatMessages.slice(-5), contextMessage] }) });
      const data = await response.json() as { answer?: string; error?: string }; if (!response.ok || !data.answer) throw new Error(data.error);
      setChatMessages((current) => [...current, { role: "assistant", content: data.answer! }]);
    } catch { setChatMessages((current) => [...current, { role: "assistant", content: "这次没有接上潮汐。你的宇宙仍然完整，可以再问一次。" }]); } finally { setChatBusy(false); }
  };

  const viewportStyle = universe ? { "--universe-zoom": zoom * universe.camera.scale, "--universe-mobile-zoom": Math.max(.54, zoom * .83 * universe.camera.scale), "--camera-x": `${universe.camera.x}px`, "--camera-y": `${universe.camera.y}px` } as CSSProperties : undefined;
  const worldStyle = active ? { transform: `translate(${-active.x}px, ${-active.y}px)` } as CSSProperties : undefined;
  const organizeReady = universe && universe.retained.length >= 4;

  return <main className={styles.page} data-hydrated={hydrated}>
    <div className={styles.paperNoise} aria-hidden="true" />
    <header className={styles.atlasHeader}><span>DUODUO OS · LIVE TOOL 05</span><h1>DIVERGENT UNIVERSE <b>发散宇宙</b></h1><p>留下想要的，让宇宙在每一次触碰里变大。</p></header>
    <a className={styles.backLink} href="/ai#take">↙ DUODUO OS / TAKE SOMETHING</a>
    <div className={styles.topTools}>{organizeReady && <button type="button" onClick={() => void organizePage(universe)} aria-label="整理当前宇宙">✦<span>整理</span></button>}{organization && <><button type="button" onClick={() => switchPage(organization.sourcePageId)}>←<span>原宇宙</span></button><button type="button" onClick={() => void refreshOrganization()}>↻<span>补充最新</span></button></>}</div>
    {organization ? <section className={styles.organizationView} aria-label="AI 整理快照">
      <div className={styles.organizationIntro}><span>AI SNAPSHOT · {new Date(organization.createdAt).toLocaleDateString("zh-CN")} · {organization.sourceNodeCount} 个节点</span><h2>{organization.title}</h2><p>{organization.summary}</p></div>
      <div className={styles.clusterGrid}>{organization.clusters.map((cluster, index) => <article className={styles.clusterIsland} key={`${cluster.title}-${index}`}>
        <input aria-label="编辑主题名称" value={cluster.title} onChange={(event) => setWithoutHistory((current) => ({ ...current, pages: current.pages.map((page) => page.id === organization.id && page.kind === "organization" ? { ...page, clusters: page.clusters.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) } : page) }))} />
        <p>{cluster.insight}</p><div>{cluster.nodeIds.map((id) => { const node = organization.nodes.find((item) => item.id === id); return node ? <button type="button" key={id} onClick={() => jumpToSource(organization.sourcePageId, id)}>{node.label}</button> : null; })}</div>
        <button type="button" className={styles.copyCluster} onClick={() => copyCluster(cluster)}>复制成新宇宙 ↗</button>
      </article>)}</div>
      {!!organization.newInsights.length && <aside className={styles.aiInsights}><span>AI 推演 · 非原始节点</span>{organization.newInsights.slice(0, 3).map((insight) => <p key={insight}>✦ {insight}</p>)}</aside>}
    </section> : universe ? <section ref={stageRef} className={styles.stage} aria-label="发散宇宙交互画布" onPointerDown={handleStagePointerDown} onPointerMove={handleStagePointerMove} onPointerUp={handleStagePointerUp} onPointerCancel={handleStagePointerUp}>
      <div className={styles.navigationStars} aria-hidden="true"><span>✦</span><i>·</i><i>·</i><span>✧</span><i>·</i><span>✦</span></div>
      {sliceLine && <svg className={styles.sliceTrace} aria-hidden="true"><line x1={sliceLine.start.x} y1={sliceLine.start.y} x2={sliceLine.end.x} y2={sliceLine.end.y} /></svg>}
      {!active ? <motion.div className={styles.seedCenter} data-node initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }}><form onSubmit={start} className={styles.seedForm}><label htmlFor="universe-seed">此刻，你想从什么开始？</label><input id="universe-seed" autoFocus value={seed} maxLength={36} onChange={(event) => setSeed(event.target.value)} placeholder="写在气泡里" autoComplete="off" /><small>PRESS ENTER · 按下回车</small></form></motion.div> :
      <div className={styles.universeViewport} style={viewportStyle}><motion.div className={styles.universeWorld} style={worldStyle} animate={{ opacity: 1 }}>
        <div className={styles.connections} aria-hidden="true">{universe.retained.map((node) => { const parent = node.parentId ? retainedById.get(node.parentId) : null; return parent ? <span className={styles.keptThread} key={`line-${node.id}`} style={lineStyle(parent, node, universe.activeId)} /> : null; })}{universe.candidates.map((node) => { const parent = node.parentId ? retainedById.get(node.parentId) : null; return parent ? <span className={styles.candidateThread} key={`candidate-line-${node.id}`} style={lineStyle(parent, node, universe.activeId)} /> : null; })}</div>
        {universe.retained.map((node) => { const isActive = node.id === universe.activeId, isEditing = editingId === node.id; return <motion.div key={node.id} data-node data-retained-id={node.id} role="button" tabIndex={0} className={`${styles.node} ${styles.keptNode} ${styles[node.kind]} ${isActive ? styles.isActive : ""} ${isEditing ? styles.isEditing : ""}`} style={pointStyle(node)} onClick={(event) => handleNodeClick(node, false, event)} onDoubleClick={(event) => event.preventDefault()} onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => { if (event.key === "Enter") centreAndGenerate(universe.id, node.id, false); if (event.key === "F2") beginEdit(node, false); }} onPointerDown={(event) => startLongPress(event, node, false)} onPointerMove={moveLongPress} onPointerUp={endLongPress} onPointerCancel={endLongPress} onContextMenu={(event) => event.preventDefault()} aria-label={`${node.label}，已保留；双击继续发散，长按编辑`}>
          {isEditing ? <form className={styles.nodeEditForm} onSubmit={(event) => { event.preventDefault(); commitEdit(node.id); }} onPointerDown={(event) => event.stopPropagation()}><input autoFocus value={editValue} maxLength={36} aria-label={`编辑${node.label}`} onChange={(event) => setEditValue(event.target.value)} onBlur={() => commitEdit(node.id)} onKeyDown={(event) => { if (event.key === "Escape") setEditingId(null); }} /><small>ENTER · 保存</small></form> : <><small>{isActive ? (pendingIds.has(node.id) ? "LISTENING" : "CURRENT CENTRE") : "KEPT"}</small><strong>{node.label}</strong><i aria-hidden="true">✦</i></>}
        </motion.div>; })}
        <AnimatePresence>{universe.candidates.map((node, index) => <motion.button type="button" key={node.id} data-node data-candidate-id={node.id} className={`${styles.node} ${styles.candidateNode} ${styles[node.kind]}`} style={{ ...pointStyle(node), "--node-delay": `${index * 34}ms` } as CSSProperties} onClick={(event) => handleNodeClick(node, true, event)} onDoubleClick={(event) => event.preventDefault()} onPointerDown={(event) => startLongPress(event, node, true)} onPointerMove={moveLongPress} onPointerUp={endLongPress} onPointerCancel={endLongPress} onContextMenu={(event) => event.preventDefault()} aria-label={`候选“${node.label}”；单击保留，双击继续发散，长按保留并编辑`} initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .42, filter: "blur(9px)" }} transition={{ duration: .42, delay: index * .034 }}><strong>{node.label}</strong><i aria-hidden="true">✦</i></motion.button>)}</AnimatePresence>
        {draftRoot && <motion.div className={`${styles.node} ${styles.draftNode} ${styles.bubble}`} style={pointStyle(draftRoot)} data-node initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }}><form className={styles.nodeEditForm} onSubmit={(event) => { event.preventDefault(); commitDraftRoot(); }} onPointerDown={(event) => event.stopPropagation()}><label htmlFor="independent-root">新的起点</label><input id="independent-root" autoFocus value={draftRoot.value} maxLength={36} placeholder="写在这里" onChange={(event) => setDraftRoot((current) => current ? { ...current, value: event.target.value } : null)} onBlur={commitDraftRoot} onKeyDown={(event) => { if (event.key === "Escape") setDraftRoot(null); }} /></form></motion.div>}
      </motion.div></div>}
    </section> : null}
    <p className={styles.status} aria-live="polite">{status}</p>
    <aside className={`${styles.chatPanel} ${chatOpen ? styles.chatOpen : ""}`}><button type="button" className={styles.chatToggle} onClick={() => setChatOpen((open) => !open)} aria-expanded={chatOpen}>AI<span>{chatOpen ? "收起" : "聊聊"}</span></button>{chatOpen && <div className={styles.chatBody}><header><b>和这个宇宙聊聊</b><small>AI 会读取当前已保留节点</small></header><div className={styles.chatMessages}>{chatMessages.length ? chatMessages.map((message, index) => <p key={`${message.role}-${index}`} data-role={message.role}>{message.content}</p>) : <p data-role="assistant">你可以告诉我：这次发散是为了什么，或者让我寻找缺少的方向。</p>}</div><form onSubmit={sendChat}><textarea value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder="补充你的 context…" rows={3} /><button type="submit" disabled={chatBusy || !chatDraft.trim()}>{chatBusy ? "…" : "发送"}</button></form></div>}</aside>
    <nav className={styles.pageDock} aria-label="宇宙页面">
      <button type="button" className={styles.undoBubble} onClick={undo} disabled={!historyCount} aria-label="撤回上一步">↶<small>撤回</small></button>
      <div className={styles.pageScroller}>{workspace.pages.map((page, index) => <button type="button" key={page.id} className={`${styles.pageBubble} ${page.id === workspace.activePageId ? styles.currentPage : ""} ${page.kind === "organization" ? styles.organizationPageBubble : ""}`} onClick={() => switchPage(page.id)}><small>{page.kind === "organization" ? "整理" : String(index + 1).padStart(2, "0")}</small><span>{page.title}</span></button>)}</div>
      {universe && <button type="button" className={styles.addPageBubble} onClick={createPage} aria-label="新建页面">＋<small>新页面</small></button>}
    </nav>
  </main>;
}

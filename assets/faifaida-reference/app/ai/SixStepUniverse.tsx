"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import styles from "./SixStepUniverse.module.css";

type Stage = "setup" | "walking" | "summarizing" | "result";
type PathSummary = { title: string; summary: string };

const TOTAL_STEPS = 6;
const CHOICE_ROUNDS = TOTAL_STEPS - 1;
const EXAMPLES = [
  ["袜子", "尼采"],
  ["离职", "大海"],
  ["孔子", "赛博朋克"],
  ["汤圆", "月球"],
] as const;

const clean = (value: string, length = 36) => value.replace(/\s+/g, " ").trim().slice(0, length);

function splitLines(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const character of Array.from(text)) {
    const next = line + character;
    if (context.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = character;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function renderShareCard(path: string[], result: PathSummary) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext("2d");
  if (!context) return canvas;

  context.fillStyle = "#F1E9DA";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.globalAlpha = .12;
  for (let index = 0; index < 220; index += 1) {
    const x = (index * 137) % canvas.width;
    const y = (index * 241) % canvas.height;
    context.fillStyle = index % 3 ? "#8A6A4A" : "#00B6C5";
    context.fillRect(x, y, 1.5, 1.5);
  }
  context.globalAlpha = 1;

  context.fillStyle = "#151A2E";
  context.font = '700 28px "Times New Roman", serif';
  context.fillText("SIX DEGREES OF THOUGHT", 84, 92);
  context.fillStyle = "#00B6C5";
  context.font = '500 26px "Songti SC", serif';
  context.fillText("六步宇宙 · 我选择的路线", 84, 136);

  const positions = path.map((_, index) => ({
    x: index % 2 === 0 ? 250 : 830,
    y: 260 + index * 125,
  }));
  context.strokeStyle = "rgba(138,106,74,.48)";
  context.lineWidth = 3;
  context.setLineDash([7, 14]);
  context.beginPath();
  positions.forEach((point, index) => {
    if (!index) context.moveTo(point.x, point.y);
    else {
      const previous = positions[index - 1];
      context.bezierCurveTo(previous.x, (previous.y + point.y) / 2, point.x, (previous.y + point.y) / 2, point.x, point.y);
    }
  });
  context.stroke();
  context.setLineDash([]);

  positions.forEach((point, index) => {
    const endpoint = index === 0 || index === path.length - 1;
    context.beginPath();
    context.ellipse(point.x, point.y, endpoint ? 105 : 88, endpoint ? 70 : 56, index % 2 ? -.08 : .08, 0, Math.PI * 2);
    context.fillStyle = endpoint ? "#151A2E" : "#FAF6EE";
    context.fill();
    context.strokeStyle = endpoint ? "#C99A3F" : "#00B6C5";
    context.lineWidth = endpoint ? 4 : 2;
    context.stroke();
    context.fillStyle = endpoint ? "#F1E9DA" : "#25262B";
    context.font = `${endpoint ? 600 : 500} ${endpoint ? 32 : 28}px "Songti SC", serif`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    const label = path[index].length > 8 ? `${path[index].slice(0, 8)}…` : path[index];
    context.fillText(label, point.x, point.y);
    context.fillStyle = endpoint ? "#C99A3F" : "#8A6A4A";
    context.font = '700 17px "Times New Roman", serif';
    context.fillText(index === 0 ? "START" : index === path.length - 1 ? "ARRIVAL" : `0${index}`, point.x, point.y - (endpoint ? 92 : 75));
  });

  roundedRect(context, 82, 1120, 916, 206, 28);
  context.fillStyle = "#E8DCC8";
  context.fill();
  context.fillStyle = "#6B3A3A";
  context.font = '600 31px "Songti SC", serif';
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillText(result.title, 124, 1176);
  context.fillStyle = "#25262B";
  context.font = '500 27px/1.5 "Songti SC", serif';
  splitLines(context, result.summary, 830).slice(0, 3).forEach((line, index) => context.fillText(line, 124, 1226 + index * 40));

  context.fillStyle = "#151A2E";
  context.font = '700 17px "Times New Roman", serif';
  context.fillText("AI GIVES DOORS. YOU CHOOSE THE ROUTE.", 84, 1380);
  context.textAlign = "right";
  context.fillStyle = "#00B6C5";
  context.fillText("faifaida.com/ai/universe/challenge", 996, 1380);
  return canvas;
}

async function reportEvent(event: "started" | "completed" | "shared" | "downloaded") {
  try {
    await fetch("/api/divergent-challenge-event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    });
  } catch {
    // Metrics must never block the challenge.
  }
}

export function SixStepUniverse({ initialStart = "", initialTarget = "" }: { initialStart?: string; initialTarget?: string }) {
  const [stage, setStage] = useState<Stage>("setup");
  const [start, setStart] = useState(() => clean(initialStart));
  const [target, setTarget] = useState(() => clean(initialTarget));
  const [context, setContext] = useState("");
  const [path, setPath] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<PathSummary>({ title: "", summary: "" });
  const [notice, setNotice] = useState("");

  const completedSteps = Math.max(0, path.length - 1);
  const current = path.at(-1) ?? clean(start);
  const progress = Math.round(completedSteps / TOTAL_STEPS * 100);
  const challengeUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const url = new URL("/ai/universe/challenge", window.location.origin);
    url.searchParams.set("from", clean(start));
    url.searchParams.set("to", clean(target));
    return url.toString();
  }, [start, target]);

  const getCandidates = async (nextPath: string[]) => {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/six-step-universe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          start: clean(start),
          target: clean(target),
          context: clean(context, 320),
          path: nextPath,
          step: nextPath.length,
        }),
      });
      const data = await response.json() as { nodes?: string[]; error?: string };
      if (!response.ok || data.nodes?.length !== 5) throw new Error(data.error || "No route appeared");
      setCandidates(data.nodes);
    } catch {
      setNotice("这一段航线暂时没出现。再听一次潮汐。 / TRY THIS STEP AGAIN");
    } finally {
      setBusy(false);
    }
  };

  const begin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const first = clean(start), last = clean(target);
    if (!first || !last || first.toLocaleLowerCase() === last.toLocaleLowerCase()) {
      setNotice("起点和终点要是两个不同的念头。 / CHOOSE TWO DIFFERENT THOUGHTS");
      return;
    }
    setStart(first);
    setTarget(last);
    setPath([first]);
    setSummary({ title: "", summary: "" });
    setStage("walking");
    void reportEvent("started");
    await getCandidates([first]);
  };

  const finish = async (nextPath: string[]) => {
    const finalPath = [...nextPath, clean(target)];
    setPath(finalPath);
    setCandidates([]);
    setStage("summarizing");
    try {
      const response = await fetch("/api/six-step-summary", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ path: finalPath, context: clean(context, 320) }),
      });
      const data = await response.json() as Partial<PathSummary> & { error?: string };
      if (!response.ok || !data.title || !data.summary) throw new Error(data.error || "Summary failed");
      setSummary({ title: data.title, summary: data.summary });
    } catch {
      setSummary({
        title: "你的脑回路拒绝直线",
        summary: `你从「${finalPath[0]}」出发，绕过 ${finalPath.slice(1, -1).join("、")}，最后抵达「${finalPath.at(-1)}」。这不是走神，是一条很有主见的支线。`,
      });
    }
    setStage("result");
    void reportEvent("completed");
  };

  const choose = (candidate: string) => {
    if (busy || stage !== "walking") return;
    const nextPath = [...path, candidate];
    // The typed start/context stay private. Learn only AI-to-AI route choices.
    if (path.length > 1) {
      void fetch("/api/divergent-feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ center: path.at(-1), candidate, distance: "far", action: "branch" }),
        keepalive: true,
      }).catch(() => undefined);
    }
    setPath(nextPath);
    setCandidates([]);
    if (nextPath.length - 1 >= CHOICE_ROUNDS) void finish(nextPath);
    else void getCandidates(nextPath);
  };

  const restart = () => {
    setPath([]);
    setCandidates([]);
    setSummary({ title: "", summary: "" });
    setNotice("");
    setStage("setup");
  };

  const getCardBlob = () => new Promise<Blob | null>((resolve) => renderShareCard(path, summary).toBlob(resolve, "image/png", .96));

  const downloadCard = async () => {
    const blob = await getCardBlob();
    if (!blob) return;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `六步宇宙-${clean(start)}-到-${clean(target)}.png`;
    link.click();
    URL.revokeObjectURL(link.href);
    setNotice("路径卡已经保存。 / CARD SAVED");
    void reportEvent("downloaded");
  };

  const shareCard = async () => {
    const blob = await getCardBlob();
    if (!blob) return;
    const file = new File([blob], "six-degrees-of-thought.png", { type: "image/png" });
    const shareData = { title: "六步宇宙", text: `我用六步把「${start}」走到了「${target}」。你会走出同一条路吗？`, url: challengeUrl, files: [file] };
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(challengeUrl);
        await downloadCard();
        setNotice("路径卡已保存，挑战链接也复制好了。 / READY TO SHARE");
      }
      void reportEvent("shared");
    } catch (error) {
      if ((error as Error).name !== "AbortError") setNotice("没有完成分享，路径卡仍然留在这里。 / SHARE CANCELLED");
    }
  };

  return <main className={styles.page}>
    <div className={styles.paperNoise} aria-hidden="true" />
    <a className={styles.backLink} href="/ai/universe">← 发散宇宙 / FREE EXPLORE</a>
    <header className={styles.header}>
      <span>DUODUO OS · SHAREABLE EXPERIMENT 01</span>
      <h1>SIX DEGREES OF THOUGHT <b>六步宇宙</b></h1>
      <p>世界上任何两个人之间，最多只隔六个人。<br />那任何两个念头之间，隔几个气泡？</p>
    </header>

    {stage === "setup" ? <section className={styles.setup}>
      <form onSubmit={begin}>
        <div className={styles.endpointRow}>
          <label><small>FROM · 从</small><input value={start} onChange={(event) => setStart(event.target.value)} maxLength={36} placeholder="袜子" autoFocus /></label>
          <span aria-hidden="true">······ ✦ ······</span>
          <label><small>TO · 到</small><input value={target} onChange={(event) => setTarget(event.target.value)} maxLength={36} placeholder="尼采" /></label>
        </div>
        <label className={styles.contextField}><span>这次为什么想连接它们？ <i>OPTIONAL CONTEXT</i></span><textarea value={context} onChange={(event) => setContext(event.target.value)} maxLength={320} rows={3} placeholder="比如：我在给一个不想像普通知识工具的 App 找营销钩子。Context 只用于这次路线与总结，不进入公共训练库。" /></label>
        <button className={styles.primaryAction} type="submit">开始连接 <span>BEGIN THE SIX STEPS ↗</span></button>
      </form>
      <div className={styles.examples}><span>试一条现成航线</span>{EXAMPLES.map(([from, to]) => <button type="button" key={`${from}-${to}`} onClick={() => { setStart(from); setTarget(to); }}>{from} → {to}</button>)}</div>
    </section> : null}

    {stage === "walking" || stage === "summarizing" ? <section className={styles.walking}>
      <div className={styles.progress}><span style={{ width: `${progress}%` }} /><b>{Math.min(completedSteps + 1, TOTAL_STEPS)} / {TOTAL_STEPS}</b></div>
      <div className={styles.pathRail} aria-label="目前的思维路径">
        {path.map((node, index) => <div key={`${node}-${index}`}><small>{index === 0 ? "START" : `0${index}`}</small><strong>{node}</strong></div>)}
        <div className={styles.pendingDestination}><small>ARRIVAL</small><strong>{target}</strong></div>
      </div>
      <div className={styles.choiceField}>
        <p>{stage === "summarizing" ? "正在读你刚刚走过的路线……" : <>从「{current}」出发，下一步你会留下哪一个？</>}</p>
        {busy || stage === "summarizing" ? <div className={styles.tideLoader}><i /><i /><i /><span>{stage === "summarizing" ? "READING YOUR ROUTE" : "LISTENING FOR FIVE DOORS"}</span></div> : <AnimatePresence>{candidates.map((candidate, index) => <motion.button type="button" key={candidate} onClick={() => choose(candidate)} className={styles.candidate} style={{ "--index": index } as CSSProperties} initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .5 }} transition={{ duration: .38, delay: index * .045 }}><small>{String(index + 1).padStart(2, "0")}</small><strong>{candidate}</strong><i aria-hidden="true">✦</i></motion.button>)}</AnimatePresence>}
      </div>
      {notice && <button type="button" className={styles.retry} onClick={() => void getCandidates(path)}>{notice}</button>}
    </section> : null}

    {stage === "result" ? <section className={styles.result}>
      <article className={styles.shareCard} aria-label="六步宇宙路径卡">
        <header><small>SIX DEGREES OF THOUGHT</small><span>六步宇宙 · 我选择的路线</span></header>
        <div className={styles.cardRoute}>{path.map((node, index) => <div key={`${node}-${index}`} className={index === 0 || index === path.length - 1 ? styles.cardEndpoint : ""}><small>{index === 0 ? "START" : index === path.length - 1 ? "ARRIVAL" : `0${index}`}</small><strong>{node}</strong></div>)}</div>
        <div className={styles.cardSummary}><h2>{summary.title}</h2><p>{summary.summary}</p></div>
        <footer><b>AI GIVES DOORS. YOU CHOOSE THE ROUTE.</b><span>faifaida.com</span></footer>
      </article>
      <div className={styles.resultActions}><button type="button" onClick={() => void shareCard()}>分享路径卡 <span>SHARE ↗</span></button><button type="button" onClick={() => void downloadCard()}>保存图片 <span>1080 × 1440</span></button><a href="/ai/universe">进入完整发散宇宙 <span>ENTER UNIVERSE →</span></a><button type="button" onClick={restart}>换两个念头 <span>START AGAIN</span></button></div>
      {notice && <p className={styles.resultNotice}>{notice}</p>}
    </section> : null}
  </main>;
}

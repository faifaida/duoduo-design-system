"use client";

import { useEffect, useRef, useState } from "react";

const MUTE_KEY = "duoduo-sound-muted";
const SOUND_KEY = "duoduo-sound-choice";

type SoundChoice = "tide" | "drop" | "shell" | "moon" | "star";

const soundOptions: Array<{ id: SoundChoice; symbol: string; en: string; zh: string }> = [
  { id: "tide", symbol: "≋", en: "TIDE WHISPER", zh: "潮汐耳语" },
  { id: "drop", symbol: "◌", en: "WATER DROP", zh: "水滴回声" },
  { id: "shell", symbol: "⌇", en: "SHELL CHIME", zh: "果壳风铃" },
  { id: "moon", symbol: "☾", en: "MOON BELL", zh: "月光空灵铃" },
  { id: "star", symbol: "✦", en: "STAR TIDE", zh: "星潮与远铃" },
];

function SpeakerIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 9v6h4l5 4V5L8 9H4z" />
      {muted ? <path d="M17 9l4 6M21 9l-4 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8 8 0 0 1 0 12" />}
    </svg>
  );
}

export function ClickSound() {
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<SoundChoice>("tide");
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  const choiceRef = useRef<SoundChoice>("tide");
  const navigatingRef = useRef(false);

  useEffect(() => {
    const isMuted = window.localStorage.getItem(MUTE_KEY) === "1";
    const storedChoice = window.localStorage.getItem(SOUND_KEY) as SoundChoice | null;
    const nextChoice = soundOptions.some((item) => item.id === storedChoice) ? storedChoice! : "tide";
    mutedRef.current = isMuted;
    choiceRef.current = nextChoice;
    const syncUi = window.setTimeout(() => {
      setMuted(isMuted);
      setChoice(nextChoice);
    }, 0);
    return () => window.clearTimeout(syncUi);
  }, []);

  const getCtx = async () => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctxRef.current = new Ctor();
    }
    if (ctxRef.current.state === "suspended") {
      try {
        await ctxRef.current.resume();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  };

  const addEcho = (ctx: AudioContext, input: AudioNode, output: AudioNode, delaySeconds: number, amount: number) => {
    const echo = ctx.createDelay(0.8);
    const feedback = ctx.createGain();
    echo.delayTime.value = delaySeconds;
    feedback.gain.value = amount;
    input.connect(echo);
    echo.connect(feedback).connect(echo);
    echo.connect(output);
  };

  const playSwell = (ctx: AudioContext, volume = 0.034, duration = 1.15) => {
    const start = ctx.currentTime;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    let foam = 0;
    for (let index = 0; index < samples.length; index += 1) {
      foam = foam * 0.972 + (Math.random() * 2 - 1) * 0.028;
      const progress = index / samples.length;
      samples[index] = foam * Math.sin(Math.PI * progress) ** 1.35;
    }
    const source = ctx.createBufferSource();
    const lowpass = ctx.createBiquadFilter();
    const highpass = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(520, start);
    lowpass.frequency.exponentialRampToValueAtTime(1800, start + duration * 0.48);
    lowpass.frequency.exponentialRampToValueAtTime(430, start + duration);
    highpass.type = "highpass";
    highpass.frequency.value = 90;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.19);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(lowpass).connect(highpass).connect(gain).connect(ctx.destination);
    source.start(start);
    source.stop(start + duration);
  };

  const playDrop = (ctx: AudioContext) => {
    const start = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.28;
    master.connect(ctx.destination);
    addEcho(ctx, master, ctx.destination, 0.21, 0.16);
    [0, 0.16].forEach((delay, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(index === 0 ? 1180 : 760, start + delay);
      oscillator.frequency.exponentialRampToValueAtTime(index === 0 ? 330 : 270, start + 0.34 + delay);
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.055 : 0.025, start + 0.012 + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.42 + delay);
      oscillator.connect(gain).connect(master);
      oscillator.start(start + delay);
      oscillator.stop(start + 0.44 + delay);
    });
  };

  const playShell = (ctx: AudioContext) => {
    const start = ctx.currentTime;
    const master = ctx.createGain();
    const air = ctx.createBiquadFilter();
    master.gain.value = 0.3;
    air.type = "lowpass";
    air.frequency.value = 3600;
    air.connect(master).connect(ctx.destination);
    addEcho(ctx, air, master, 0.18, 0.17);
    [659.25, 987.77, 1318.51, 1760].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = [0, 0.08, 0.17, 0.28][index];
      oscillator.type = index === 0 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start + delay);
      oscillator.detune.value = index % 2 ? 5 : -4;
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.028 : 0.017, start + delay + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + 1.35);
      oscillator.connect(gain).connect(air);
      oscillator.start(start + delay);
      oscillator.stop(start + delay + 1.4);
    });
  };

  const playMoon = (ctx: AudioContext) => {
    const start = ctx.currentTime;
    const master = ctx.createGain();
    const shimmer = ctx.createBiquadFilter();
    master.gain.value = 0.24;
    shimmer.type = "highshelf";
    shimmer.frequency.value = 1300;
    shimmer.gain.value = 3;
    shimmer.connect(master).connect(ctx.destination);
    addEcho(ctx, shimmer, master, 0.29, 0.24);
    [523.25, 1046.5, 1567.98].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = index * 0.11;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start + delay);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.994, start + delay + 1.75);
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.032 : 0.018, start + delay + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + delay + 1.8);
      oscillator.connect(gain).connect(shimmer);
      oscillator.start(start + delay);
      oscillator.stop(start + delay + 1.85);
    });
  };

  const playStar = (ctx: AudioContext) => {
    playSwell(ctx, 0.022, 1.35);
    window.setTimeout(() => {
      const start = ctx.currentTime;
      [1318.51, 1975.53].forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start + index * 0.13);
        gain.gain.exponentialRampToValueAtTime(0.018, start + index * 0.13 + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + index * 0.13 + 1.2);
        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(start + index * 0.13);
        oscillator.stop(start + index * 0.13 + 1.25);
      });
    }, 150);
  };

  const playChoice = async (nextChoice: SoundChoice, force = false) => {
    if (mutedRef.current && !force) return;
    const ctx = await getCtx();
    if (!ctx) return;
    if (nextChoice === "tide") playSwell(ctx);
    if (nextChoice === "drop") playDrop(ctx);
    if (nextChoice === "shell") playShell(ctx);
    if (nextChoice === "moon") playMoon(ctx);
    if (nextChoice === "star") playStar(ctx);
  };

  const playPassage = async () => {
    if (mutedRef.current) return;
    const ctx = await getCtx();
    if (!ctx) return;
    playSwell(ctx, 0.04, 1.45);
    if (choiceRef.current !== "tide") {
      window.setTimeout(() => void playChoice(choiceRef.current), 170);
    }
  };

  useEffect(() => {
    const handler = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.closest("[data-sound-control], input, textarea, select, label")) return;
      void getCtx();
      const link = target.closest("a");
      if (link) {
        void playPassage();
        return;
      }
      if (target.closest('button, [role="button"], .map-island')) {
        void playChoice(choiceRef.current);
      }
    };
    const holdNavigationForWave = (event: MouseEvent) => {
      if (mutedRef.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      const link = target?.closest<HTMLAnchorElement>("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const sameDocumentHash = url.pathname === window.location.pathname && url.search === window.location.search && Boolean(url.hash);
      if (sameDocumentHash || navigatingRef.current) return;
      event.preventDefault();
      navigatingRef.current = true;
      window.setTimeout(() => window.location.assign(url.href), 430);
    };
    const closeSoundLab = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest("[data-sound-control]")) setOpen(false);
    };
    document.addEventListener("pointerdown", handler, true);
    document.addEventListener("pointerdown", closeSoundLab);
    document.addEventListener("click", holdNavigationForWave, true);
    return () => {
      document.removeEventListener("pointerdown", handler, true);
      document.removeEventListener("pointerdown", closeSoundLab);
      document.removeEventListener("click", holdNavigationForWave, true);
    };
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    if (!next) void playChoice(choiceRef.current, true);
  };

  const chooseSound = (nextChoice: SoundChoice) => {
    setChoice(nextChoice);
    choiceRef.current = nextChoice;
    setMuted(false);
    mutedRef.current = false;
    window.localStorage.setItem(MUTE_KEY, "0");
    window.localStorage.setItem(SOUND_KEY, nextChoice);
    void playChoice(nextChoice, true);
  };

  return (
    <div className={`sound-control ${open ? "is-open" : ""}`} data-sound-control>
      <button
        type="button"
        className="chrome-sound"
        aria-pressed={!muted}
        aria-label={muted ? "开启海洋音效 / Turn ocean sounds on" : "关闭海洋音效 / Turn ocean sounds off"}
        title={muted ? "开启海洋音效 / Sound on" : "关闭海洋音效 / Sound off"}
        onClick={toggle}
      >
        <SpeakerIcon muted={muted} />
      </button>
      <button
        type="button"
        className="sound-lab-trigger"
        aria-expanded={open}
        aria-label="试听五种音效 / Preview five sound options"
        onClick={() => setOpen(!open)}
      >
        ✧
      </button>
      <div className="sound-lab-panel">
        <header><span>SOUND PLAYGROUND</span><b>五种空灵自然音效</b></header>
        {soundOptions.map((option, index) => (
          <button key={option.id} type="button" className={choice === option.id ? "is-selected" : ""} onClick={() => chooseSound(option.id)}>
            <i>{option.symbol}</i>
            <span><small>0{index + 1}</small><b>{option.en}</b><em>{option.zh}</em></span>
            <strong>{choice === option.id ? "SELECTED" : "PLAY"}</strong>
          </button>
        ))}
        <p>点击试听并自动选择，之后网站按键将使用这一种声音。</p>
      </div>
    </div>
  );
}

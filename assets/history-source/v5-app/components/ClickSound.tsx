"use client";

import { useEffect, useRef, useState } from "react";

const MUTE_KEY = "duoduo-sound-muted";

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
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  const gestureRef = useRef(0);
  const navigatingRef = useRef(false);

  useEffect(() => {
    const isMuted = window.localStorage.getItem(MUTE_KEY) === "1";
    mutedRef.current = isMuted;
    const syncUi = window.setTimeout(() => setMuted(isMuted), 0);
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

  const playShellChime = async () => {
    if (mutedRef.current) return;
    const ctx = await getCtx();
    if (!ctx) return;
    const start = ctx.currentTime;
    const master = ctx.createGain();
    const air = ctx.createBiquadFilter();
    air.type = "lowpass";
    air.frequency.value = 3100;
    master.gain.value = 0.48;
    air.connect(master).connect(ctx.destination);

    [720, 1080, 1510].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = index * 0.045;
      oscillator.type = index === 1 ? "triangle" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start + delay);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.985, start + 0.66 + delay);
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.036 : 0.024, start + 0.018 + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.7 + delay);
      oscillator.connect(gain).connect(air);
      oscillator.start(start + delay);
      oscillator.stop(start + 0.74 + delay);
    });
  };

  const playWaterDrop = async () => {
    if (mutedRef.current) return;
    const ctx = await getCtx();
    if (!ctx) return;
    const start = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.42;
    master.connect(ctx.destination);

    [0, 0.095].forEach((delay, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(index === 0 ? 930 : 650, start + delay);
      oscillator.frequency.exponentialRampToValueAtTime(index === 0 ? 310 : 260, start + 0.24 + delay);
      gain.gain.setValueAtTime(0.0001, start + delay);
      gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.07 : 0.024, start + 0.012 + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3 + delay);
      oscillator.connect(gain).connect(master);
      oscillator.start(start + delay);
      oscillator.stop(start + 0.32 + delay);
    });
  };

  const playPassageWave = async () => {
    if (mutedRef.current) return;
    const ctx = await getCtx();
    if (!ctx) return;
    const start = ctx.currentTime;
    const duration = 0.86;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const samples = buffer.getChannelData(0);
    let foam = 0;
    for (let index = 0; index < samples.length; index += 1) {
      foam = foam * 0.965 + (Math.random() * 2 - 1) * 0.035;
      const progress = index / samples.length;
      const envelope = Math.sin(Math.PI * progress) ** 1.5;
      samples[index] = foam * envelope * 1.7;
    }
    const source = ctx.createBufferSource();
    const lowpass = ctx.createBiquadFilter();
    const highpass = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = buffer;
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(1700, start);
    lowpass.frequency.exponentialRampToValueAtTime(520, start + duration);
    highpass.type = "highpass";
    highpass.frequency.value = 120;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.055, start + 0.17);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.connect(lowpass).connect(highpass).connect(gain).connect(ctx.destination);
    source.start(start);
    source.stop(start + duration);
    window.setTimeout(() => void playShellChime(), 80);
  };

  useEffect(() => {
    const handler = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.closest("[data-sound-toggle], input, textarea, select, label")) return;
      void getCtx();
      const link = target.closest("a");
      if (link) {
        void playPassageWave();
        return;
      }
      if (target.closest('button, [role="button"], .map-island')) {
        gestureRef.current += 1;
        if (gestureRef.current % 2 === 0) void playWaterDrop();
        else void playShellChime();
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
      window.setTimeout(() => window.location.assign(url.href), 170);
    };
    document.addEventListener("pointerdown", handler, true);
    document.addEventListener("click", holdNavigationForWave, true);
    return () => {
      document.removeEventListener("pointerdown", handler, true);
      document.removeEventListener("click", holdNavigationForWave, true);
    };
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
    if (!next) void playShellChime();
  };

  return (
    <button
      type="button"
      className="chrome-sound"
      data-sound-toggle
      aria-pressed={!muted}
      aria-label={muted ? "开启海洋音效 / Turn ocean sounds on" : "关闭海洋音效 / Turn ocean sounds off"}
      title={muted ? "开启海洋音效 / Sound on" : "关闭海洋音效 / Sound off"}
      onClick={toggle}
    >
      <SpeakerIcon muted={muted} />
    </button>
  );
}

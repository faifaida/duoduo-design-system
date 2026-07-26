"use client";

import { useEffect, useRef } from "react";
import { createNoise2D } from "simplex-noise";

export function LivingOceanCanvas({ calm = false, vivid = false }: { calm?: boolean; vivid?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const noise = createNoise2D();
    const ocean = new Image();
    const pointer = { x: window.innerWidth * 0.65, y: window.innerHeight * 0.5, active: false };
    let frame = 0;
    let raf = 0;
    let ready = false;
    let lastDraw = 0;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const move = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };

    const drawDistortedOcean = (width: number, height: number, time: number) => {
      if (!ready) return;
      const imageRatio = ocean.width / ocean.height;
      const screenRatio = width / height;
      let sourceWidth = ocean.width;
      let sourceHeight = ocean.height;
      let sourceX = 0;
      let sourceY = 0;
      if (imageRatio > screenRatio) {
        sourceWidth = ocean.height * screenRatio;
        sourceX = (ocean.width - sourceWidth) / 2;
      } else {
        sourceHeight = ocean.width / screenRatio;
        sourceY = (ocean.height - sourceHeight) / 2;
      }

      const slice = calm ? 14 : vivid ? 7 : 10;
      const amplitude = calm ? 2.5 : vivid ? 10 : 5.5;
      context.save();
      context.globalAlpha = calm ? 0.2 : vivid ? 0.58 : 0.34;
      context.globalCompositeOperation = "soft-light";
      for (let y = 0; y < height; y += slice) {
        const normalizedY = y / height;
        const current = Math.sin(normalizedY * 18 + time * 1.4) * amplitude;
        const swell = noise(normalizedY * 2.8, time * 0.17) * amplitude * 1.4;
        const pointerPull = pointer.active
          ? Math.exp(-Math.pow((y - pointer.y) / (vivid ? 210 : 150), 2)) * Math.sin(time * 2.4 + y * 0.035) * (vivid ? 15 : 4)
          : 0;
        const sx = sourceX;
        const sy = sourceY + normalizedY * sourceHeight;
        const sh = (slice / height) * sourceHeight + 2;
        context.drawImage(ocean, sx, sy, sourceWidth, sh, current + swell + pointerPull - 8, y, width + 16, slice + 1);
      }
      context.restore();
    };

    const drawCaustics = (width: number, height: number, time: number) => {
      context.save();
      context.globalCompositeOperation = "screen";
      const bands = calm ? 5 : vivid ? 12 : 8;
      for (let band = 0; band < bands; band += 1) {
        const baseY = (height / (bands + 1)) * (band + 1);
        context.beginPath();
        for (let x = -30; x <= width + 30; x += 14) {
          const longWave = noise(x * 0.0022 + time * 0.14, band * 0.21 + time * 0.09);
          const crest = Math.sin(x * 0.013 + time * 0.8 + band) * (calm ? 2 : 4);
          const y = baseY + longWave * (calm ? 8 : 15) + crest;
          if (x === -30) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.strokeStyle = `rgba(226,255,249,${(vivid ? 0.048 : 0.026) + (band % 3) * (vivid ? 0.018 : 0.012)})`;
        context.lineWidth = band % 4 === 0 ? (vivid ? 2.1 : 1.5) : (vivid ? 1.05 : 0.7);
        context.stroke();
      }

      if (pointer.active && !reduced) {
        const pulse = (vivid ? 20 : 34) + (frame % 110) * (vivid ? 0.92 : 0.72);
        for (let ring = 0; ring < (vivid ? 5 : 3); ring += 1) {
          context.beginPath();
          context.ellipse(pointer.x, pointer.y, pulse + ring * 24, (pulse + ring * 24) * (vivid ? 0.34 : 0.28), -0.05, 0, Math.PI * 2);
          context.strokeStyle = `rgba(182,255,244,${(vivid ? 0.3 : 0.16) - ring * (vivid ? 0.045 : 0.035)})`;
          context.lineWidth = vivid ? 1.35 : 1;
          context.stroke();
        }
      }
      context.restore();
    };

    const draw = (timestamp = 0) => {
      if (!reduced && timestamp - lastDraw < 33) {
        raf = window.requestAnimationFrame(draw);
        return;
      }
      lastDraw = timestamp;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const time = reduced ? 0 : frame * (calm ? 0.012 : 0.018);
      context.clearRect(0, 0, width, height);
      drawDistortedOcean(width, height, time);
      drawCaustics(width, height, time);
      frame += 1;
      if (!reduced) raf = window.requestAnimationFrame(draw);
    };

    ocean.onload = () => { ready = true; };
    ocean.src = "/ocean/duoduo-living-ocean.png";
    if (ocean.complete && ocean.naturalWidth > 0) ready = true;
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    draw();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [calm, vivid]);

  return <canvas ref={canvasRef} className={`living-ocean-canvas${vivid ? " is-vivid" : ""}`} aria-hidden="true" />;
}

"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#2ea043", "#40bcf4", "#ff8000", "#e5c07b", "#c678dd"];

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let instance: ReturnType<typeof import("canvas-confetti").create> | null = null;

    import("canvas-confetti").then(({ create }) => {
      if (cancelled) return;

      instance = create(canvas, { resize: true, useWorker: true });
      instance({
        particleCount: 60,
        spread: 70,
        startVelocity: 22,
        gravity: 0.9,
        scalar: 0.7,
        ticks: 90,
        colors: COLORS,
        origin: { x: 0.5, y: 0.6 },
        disableForReducedMotion: true,
      });
    });

    return () => {
      cancelled = true;
      instance?.reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute -inset-x-8 -top-16 bottom-0 z-10 h-40 w-[calc(100%+4rem)]"
    />
  );
}

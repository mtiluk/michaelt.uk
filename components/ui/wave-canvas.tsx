"use client";
import { useEffect, useRef, useState } from "react";
import {
  createDitheredWaves,
  createDitheredWavesStill,
  type DitheredWavesHandle,
} from "@/lib/dithered-waves";
import { useReducedMotion } from "motion/react";
import { usePalette } from "@/components/providers/palette-provider";
import { mixHex } from "@/lib/color";

export type WaveVariant = "hero" | "logo";

type WaveCanvasProps = {
  color?: string;
  variant: WaveVariant;
  animate?: boolean;
  background?: string;
};

const VARIANTS = {
  hero: { pixelSize: 3, colorNum: 8, waveSpeed: 0.02, waveFrequency: 3.2 },
  logo: { pixelSize: 1, colorNum: 3, waveSpeed: 0.04, waveFrequency: 2.5 },
} as const;

const FADE_MS = 400;
const FPS = 30;
const APPEAR_MS = { hero: 800, logo: 300 } as const;

function cellPixelRatio(pixelSize: number) {
  return Math.min(window.devicePixelRatio || 1, 2) / Math.max(1, pixelSize);
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export default function WaveCanvas({
  color,
  variant,
  animate: animateProp = variant === "hero",
  background,
}: WaveCanvasProps) {
  const { palette, ready } = usePalette();
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<DitheredWavesHandle | null>(null);
  const [failed, setFailed] = useState(false);

  const waveColor = color ?? palette.highlight;
  const baseColor = background ?? palette.background;
  const shown = useRef({ waveColor, baseColor });
  const shouldAnimate = animateProp && !reduced;
  const animate = useRef(shouldAnimate);

  useEffect(() => {
    animate.current = shouldAnimate;
    handleRef.current?.setOptions({ animate: shouldAnimate });
  }, [shouldAnimate]);

  useEffect(() => {
    if (!handleRef.current) {
      shown.current = { waveColor, baseColor };
      return;
    }
    const from = { ...shown.current };
    const apply = (t: number) => {
      shown.current = {
        waveColor: mixHex(from.waveColor, waveColor, t),
        baseColor: mixHex(from.baseColor, baseColor, t),
      };
      handleRef.current?.setOptions(shown.current);
    };

    if (reduced || (from.waveColor === waveColor && from.baseColor === baseColor)) {
      apply(1);
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const t = Math.min(1, (now - start) / FADE_MS);
      apply(easeInOut(t));
      if (t < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [waveColor, baseColor, reduced]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !ready) return;
    const { pixelSize, ...settings } = VARIANTS[variant];
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className =
      "absolute inset-0 block size-full opacity-0 transition-opacity ease-out motion-reduce:transition-none [image-rendering:pixelated]";
    canvas.style.transitionDuration = `${APPEAR_MS[variant]}ms`;
    container.appendChild(canvas);

    try {
      const create = variant === "logo" ? createDitheredWavesStill : createDitheredWaves;
      handleRef.current = create(canvas, {
        ...shown.current,
        ...settings,
        waveAmplitude: 0.5,
        pixelRatio: cellPixelRatio(pixelSize),
        animate: animate.current,
        fps: FPS,
      });
    } catch (err) {
      console.error("[wave]", err);
      canvas.remove();
      setFailed(true);
      return;
    }

    let appear = requestAnimationFrame(() => {
      appear = requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    });
    return () => {
      cancelAnimationFrame(appear);
      handleRef.current?.destroy();
      handleRef.current = null;
      canvas.remove();
    };
  }, [variant, ready]);

  if (failed) {
    return <div className="absolute inset-0" style={{ background: baseColor }} />;
  }

  return <div ref={containerRef} className="absolute inset-0" />;
}

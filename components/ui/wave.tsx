"use client";
import { DitheredWaves } from "ditherwave";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePalette } from "@/components/providers/palette-provider";

type WaveProps = {
  color?: string;
  className?: string;
  variant?: "hero" | "logo";
};

const VARIANTS = {
  hero: { pixelSize: 3, colorNum: 8, waveSpeed: 0.02, waveFrequency: 3.2 },
  logo: { pixelSize: 0.5, colorNum: 3, waveSpeed: 0.04, waveFrequency: 4 },
} as const;

export default function Wave({ color, className, variant = "hero" }: WaveProps) {
  const { name, palette } = usePalette();
  const reduced = useReducedMotion();

  const canvas = (waveColor: string) => (
    <DitheredWaves
      waveColor={waveColor}
      baseColor={palette.background}
      waveAmplitude={0.5}
      enableMouseInteraction={false}
      {...VARIANTS[variant]}
    />
  );

  if (color) {
    return <div className={cn("absolute", className)}>{canvas(color)}</div>;
  }

  return (
    <div className={cn("absolute overflow-hidden", className)}>
      <AnimatePresence initial={false}>
        <motion.div
          key={name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.4, ease: "easeInOut" }}
          className="absolute inset-0 z-0"
        >
          {canvas(palette.highlight)}
        </motion.div>
      </AnimatePresence>

      {variant === "hero" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-background via-background/85 to-background/30"
        />
      )}
    </div>
  );
}

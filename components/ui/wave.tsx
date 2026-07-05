"use client";
import { DitheredWaves } from "ditherwave";
import { cn } from "@/lib/utils";

type WaveProps = {
  color?: string;
  className?: string;
  variant?: "hero" | "logo";
};

const VARIANTS = {
  hero: { pixelSize: 3, colorNum: 8, waveSpeed: 0.02, waveFrequency: 3.2 },
  logo: { pixelSize: 0.5, colorNum: 3, waveSpeed: 0.04, waveFrequency: 4 },
} as const;

export default function Wave({ color = "#ff003c", className, variant = "hero", }: WaveProps) {
  return (
    <div className={cn("absolute", className)}>
      <DitheredWaves
        waveColor={color}
        baseColor="#0B0504"
        waveAmplitude={0.5}
        enableMouseInteraction={false}
        {...VARIANTS[variant]}
      />
    </div>
  );
}

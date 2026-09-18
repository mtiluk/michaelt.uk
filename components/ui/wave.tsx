"use client";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { WaveVariant } from "@/components/ui/wave-canvas";

type WaveProps = {
  color?: string;
  className?: string;
  variant?: WaveVariant;
  animate?: boolean;
  background?: string;
};

const WaveCanvas = dynamic(() => import("@/components/ui/wave-canvas"), { ssr: false });

export default function Wave({ color, className, variant = "hero", animate, background }: WaveProps) {
  return (
    <div className={cn("absolute overflow-hidden", className)}>
      <WaveCanvas color={color} variant={variant} animate={animate} background={background} />

      {variant === "hero" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-background via-background/95 to-background/40"
        />
      )}
    </div>
  );
}

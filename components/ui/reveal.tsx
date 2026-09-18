import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import RevealInView from "./reveal-in-view";

type RevealVariant = "fade" | "fade-up" | "fade-down" | "blur-up" | "scale";

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  inView?: boolean;
  className?: string;
};

export function Reveal({ children, variant = "fade-up", delay = 0, duration = 0.4, inView = false, className }: RevealProps) {
  const style = {
    "--reveal-name": `reveal-${variant}`,
    "--reveal-delay": `${delay}s`,
    "--reveal-duration": `${duration}s`,
  } as CSSProperties;

  if (inView) {
    return (
      <RevealInView className={cn("reveal-in-view", className)} style={style}>
        {children}
      </RevealInView>
    );
  }

  return (
    <div className={cn("reveal", className)} style={style}>
      {children}
    </div>
  );
}

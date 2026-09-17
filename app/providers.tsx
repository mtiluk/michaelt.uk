"use client";
import type { ReactNode } from "react";
import { domAnimation, LazyMotion } from "motion/react";
import { SoundProvider } from "@web-kits/audio/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <SoundProvider volume={0.8}>{children}</SoundProvider>
    </LazyMotion>
  );
}

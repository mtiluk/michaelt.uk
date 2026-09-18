"use client";
import type { ReactNode } from "react";
import { domAnimation, LazyMotion } from "motion/react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}

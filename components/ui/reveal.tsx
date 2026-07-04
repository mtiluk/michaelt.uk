"use client";
import { motion, MotionConfig, type Variants } from "motion/react";
import type { ReactNode } from "react";

export type RevealVariant =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "blur-up"
  | "scale";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const VARIANTS: Record<RevealVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  "fade-up": {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
  },
  "blur-up": {
    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.97 },
    show: { opacity: 1, scale: 1 },
  },
};

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  inView?: boolean;
  className?: string;
};

export function Reveal({ children, variant = "fade-up", delay = 0, duration = 0.4, inView = false, className, }: RevealProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={VARIANTS[variant]}
        initial="hidden"
        {...(inView
          ? { whileInView: "show", viewport: { once: true, margin: "-40px" } }
          : { animate: "show" })}
        transition={{ duration, delay, ease: EASE }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

type StaggerProps = {
  children: ReactNode;
  interval?: number;
  delay?: number;
  inView?: boolean;
  className?: string;
};

export function Stagger({ children, interval = 0.05, delay = 0, inView = false, className, }: StaggerProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial="hidden"
        {...(inView
          ? { whileInView: "show", viewport: { once: true, margin: "-40px" } }
          : { animate: "show" })}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: interval, delayChildren: delay },
          },
        }}
        className={className}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}

export function StaggerItem({ children, variant = "fade-up", className, }: { children: ReactNode; variant?: RevealVariant; className?: string; }) {
  return (
    <motion.div variants={VARIANTS[variant]} transition={{ duration: 0.4, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

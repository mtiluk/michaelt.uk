"use client";
import { m } from "motion/react";
import Confetti from "@/components/ui/confetti";

export default function ContactSuccess({ email }: { email: string }) {
  return (
    <m.div
      key="success"
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="relative flex flex-1 items-center gap-2.5"
    >
      <Confetti />

      <div role="status" className="min-w-0">
        <p className="text-[12px] text-text-highlight">Message sent</p>
        <p className="truncate text-[11px] text-foreground/40">
          I&apos;ll reply to {email.trim()} soon.
        </p>
      </div>
    </m.div>
  );
}

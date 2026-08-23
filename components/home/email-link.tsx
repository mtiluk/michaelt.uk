"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { Check } from "lucide-react";
import { MdEmail } from "@/components/icons/brand";

const COPIED_MS = 1600;

export default function EmailLink({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      window.location.href = `mailto:${email}`;
      return;
    }

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <MotionConfig reducedMotion="user">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        className="inline-flex items-center gap-1 rounded-md text-[11px] text-foreground/75 transition-all hover:text-text-highlight/75 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/50"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? "copied" : "idle"}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -3 }}
            transition={{ duration: 0.12 }}
            className={`inline-flex items-center gap-1 ${copied ? "text-text-highlight" : ""}`}
          >
            {copied ? <Check className="h-3 w-3" aria-hidden /> : <MdEmail aria-hidden />}
            {copied ? "Copied" : "Email"}
          </motion.span>
        </AnimatePresence>
      </button>
    </MotionConfig>
  );
}

"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 160;

export default function SocialShell({
  icon,
  href,
  label,
  children,
}: {
  icon: React.ReactNode;
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const play = useSound(retro.hover);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function schedule(next: boolean) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), next ? OPEN_DELAY : CLOSE_DELAY);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative"
        onMouseEnter={() => schedule(true)}
        onMouseLeave={() => schedule(false)}
        onFocusCapture={() => setOpen(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        <Link
          href={href}
          target="_blank"
          aria-label={label}
          onMouseEnter={play}
          className="relative flex items-center rounded-md p-1.5 text-[10px] text-foreground transition-colors duration-200 hover:bg-text-highlight/10 hover:text-text-highlight"
        >
          {icon}
        </Link>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              className="absolute bottom-full left-0 z-30 mb-2 origin-bottom-left"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

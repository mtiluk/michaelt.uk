"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Check, Link2, MoreHorizontal, Share2 } from "lucide-react";

const TARGETS = [
  {
    label: "Post on X",
    icon: ArrowUpRight,
    href: (url: string, text: string) => `https://x.com/intent/post?text=${text}&url=${url}`,
  },
] as const;

const COPIED_MS = 1000;

const subscribeToNothing = () => () => {};

export default function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const canNativeShare = useSyncExternalStore(
    subscribeToNothing,
    () => typeof navigator.share === "function",
    () => false,
  );

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const defer = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      setOpen(false);
      return;
    }

    setCopied(true);
    defer(() => {
      setOpen(false);
      defer(() => setCopied(false), 200);
    }, COPIED_MS);
  }

  async function shareNative() {
    setOpen(false);
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {}
  }

  function openTarget(href: (url: string, text: string) => string) {
    setOpen(false);
    const url = href(encodeURIComponent(window.location.href), encodeURIComponent(title));
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const itemClass = cn(
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left",
    "text-[11px] text-foreground/45 transition-colors",
    "hover:bg-text-highlight/4 hover:text-text-highlight",
  );

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label="Share this post"
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full",
            "border border-foreground/20 bg-text-highlight/4 transition-colors duration-300",
            open
              ? "border-text-highlight/20 bg-text-highlight/10 text-text-highlight"
              : "text-foreground/70 hover:border-text-highlight/20 hover:text-text-highlight",
          )}
        >
          <MoreHorizontal className="h-3.5 w-3.5" aria-hidden />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              key="menu"
              role="menu"
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={cn(
                "absolute right-0 top-9 z-50 w-40 origin-top-right p-1",
                "rounded-xl border border-foreground/15 bg-background/90",
                "shadow-lg shadow-black/30 backdrop-blur-md",
              )}
            >
              <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "copy"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className={cn("flex items-center gap-2", copied && "text-text-highlight")}
                  >
                    {copied ? <Check className="h-3 w-3" aria-hidden /> : <Link2 className="h-3 w-3" aria-hidden />}
                    {copied ? "Copied" : "Copy link"}
                  </motion.span>
                </AnimatePresence>
              </button>

              {canNativeShare && (
                <button type="button" role="menuitem" onClick={shareNative} className={itemClass}>
                  <Share2 className="h-3 w-3" aria-hidden />
                  Share via…
                </button>
              )}

              <div className="mx-2.5 my-1 border-t border-foreground/10" />

              {TARGETS.map(({ label, icon: Icon, href }) => (
                <button key={label} type="button" role="menuitem" onClick={() => openTarget(href)} className={itemClass}>
                  <Icon className="h-3 w-3" aria-hidden />
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

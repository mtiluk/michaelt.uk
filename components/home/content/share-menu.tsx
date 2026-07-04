// components/home/content/share-menu.tsx
//
// Triple-dot share menu for the post header. A quiet icon button that
// opens a small frosted dropdown (same surface as the mobile TOC bar):
//
//   Copy link       — clipboard, with an animated "Copied" confirmation
//   Share via…      — the OS-native share sheet (only where supported,
//                     i.e. most phones + Safari; hidden elsewhere)
//   Post on X       — share intent in a new tab
//   LinkedIn        — same
//
// The URL is read from window.location at click time, so the component
// needs no props beyond the title (used as the share text).
//
// Usage:  <ShareMenu title={blog.title} />
//
"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Link2,
  MoreHorizontal,
  Share2,
} from "lucide-react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";

export default function ShareMenu({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // navigator.share only exists on some platforms. Safe to check at
  // render: the item this gates only renders once the menu is open,
  // which requires a click, which requires a mounted client — so the
  // server's initial HTML (menu closed) can never mismatch. The typeof
  // guard is still needed because this line runs during SSR.
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  // Dismiss on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      // Show the confirmation briefly, then close and reset.
      setTimeout(() => {
        setOpen(false);
        // Reset after the exit animation so "Copied" doesn't flash
        // back to "Copy link" while still visible.
        setTimeout(() => setCopied(false), 200);
      }, 1000);
    } catch {
      // Clipboard can be denied (permissions, http) — fail silently,
      // the menu simply stays open.
    }
  }

  function shareNative() {
    navigator.share({ title, url: window.location.href }).catch(() => {
      // User dismissed the sheet — not an error.
    });
    setOpen(false);
  }

  function shareExternal(buildUrl: (url: string, text: string) => string) {
    const url = buildUrl(
      encodeURIComponent(window.location.href),
      encodeURIComponent(title),
    );
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  const itemClass = cn(
    "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left",
    "text-[11px] text-foreground/45 transition-colors",
    "hover:bg-text-highlight/4 hover:text-text-highlight",
  );

  return (
    <MotionConfig reducedMotion="user">
      <div ref={rootRef} className="relative">
        {/* Trigger: quiet triple-dot, warms on hover / while open. */}
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
              // Anchored to the trigger's top-right corner, unfolding
              // downward-left — origin matters for the scale to feel
              // like it grows out of the button.
              className={cn(
                "absolute right-0 top-9 z-50 w-40 origin-top-right p-1",
                "rounded-xl border border-foreground/15 bg-background/90",
                "shadow-lg shadow-black/30 backdrop-blur-md",
              )}
            >
              <button type="button" role="menuitem" onClick={copyLink} className={itemClass}>
                {/* Icon + label swap to a confirmation once copied. */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "copied" : "copy"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className={cn(
                      "flex items-center gap-2",
                      copied && "text-text-highlight",
                    )}
                  >
                    {copied ? (
                      <Check className="h-3 w-3" aria-hidden />
                    ) : (
                      <Link2 className="h-3 w-3" aria-hidden />
                    )}
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

              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  shareExternal(
                    (url, text) => `https://x.com/intent/post?text=${text}&url=${url}`,
                  )
                }
                className={itemClass}
              >
                <ArrowUpRight className="h-3 w-3" aria-hidden />
                Post on X
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() =>
                  shareExternal(
                    (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
                  )
                }
                className={itemClass}
              >
                <ArrowUpRight className="h-3 w-3" aria-hidden />
                LinkedIn
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

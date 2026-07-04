// components/home/content/mobile-toc.tsx
//
// Mobile-only table of contents, redesigned as a full-width bar pinned to
// the bottom of the viewport (inset by the page's side padding):
//
//   ┌─────────────────────────────────────────────┐
//   │  ‹current section title, ticker-animated›  ^ │
//   ├─────────────────────────────────────────────┤
//   │ ▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░  ← reading progress   │
//   └─────────────────────────────────────────────┘
//
// - As you scroll past headings, the next title slides in (motion ticker).
// - Tapping the bar slides the full heading list up above it; tapping a
//   heading, the backdrop, or Escape closes it again.
// - A hairline progress bar along the bottom edge fills with overall
//   scroll progress, spring-smoothed so it glides instead of stuttering.
//
// The expanded list reuses <TableOfContents />, so the sliding rail and
// active-heading behavior match desktop exactly.
//
// Usage (unchanged): <MobileToc items={toc} />
//
"use client";
import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useScroll,
  useSpring,
} from "motion/react";
import TableOfContents from "./table-of-contents";
import type { TocItem } from "@/lib/toc";

export default function MobileToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("");

  // ── Reading progress ───────────────────────────────────────────────────
  // useScroll gives 0→1 for the whole page; the spring smooths it so the
  // bar glides between scroll events. High stiffness keeps it feeling
  // immediate rather than laggy.
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001,
  });

  // ── Track the active heading ───────────────────────────────────────────
  // Same logic as TableOfContents. It's duplicated (rather than lifted
  // into shared state) because the two components never render at the
  // same time — one is lg-only, this one is lg:hidden.
  useEffect(() => {
    if (items.length === 0) return;
    const lastId = items[items.length - 1]?.id;
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    function onScroll() {
      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 28;
      if (reachedBottom && lastId) {
        setActiveId(lastId);
        return;
      }
      const line = window.innerHeight * 0.3;
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) {
          current = heading.id;
        } else {
          break;
        }
      }
      setActiveId(current);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (items.length === 0) return null;

  const activeItem = items.find((item) => item.id === activeId);

  return (
    // reducedMotion="user" makes every motion.* element inside respect
    // prefers-reduced-motion automatically — animations become instant.
    <MotionConfig reducedMotion="user">
      <div className="lg:hidden">
        <AnimatePresence>
          {open && (
            // Dim + slightly blur the page behind the open list;
            // tapping it dismisses.
            <motion.button
              key="backdrop"
              type="button"
              aria-label="Close table of contents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-background/40 backdrop-blur-[2px]"
            />
          )}
        </AnimatePresence>

        {/* The bar: full width minus the page's side padding, pinned to
            the bottom with safe-area clearance for iOS home indicators.
            The shadow is what separates it from the page — floating
            elements read as "above" through elevation, not color. */}
        <div
          className="fixed inset-x-4 z-50 overflow-hidden rounded-xl border border-foreground/15 bg-background/90 shadow-lg shadow-black/30 backdrop-blur-md"
          style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          {/* ── Expanded list: slides up above the bar row ──
              Animating height 0 → auto is what makes it feel like the
              list is pushed up out of the bar itself. */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="list"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                // Close when any heading link inside is tapped — capture
                // phase, since the links belong to nested TableOfContents.
                onClickCapture={(e) => {
                  if ((e.target as HTMLElement).closest("a")) setOpen(false);
                }}
                className="overflow-hidden"
              >
                <div className="max-h-[50vh] overflow-y-auto border-b border-foreground/10 p-4">
                  <TableOfContents items={items} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Collapsed row: current section (ticker) + chevron ── */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={
              open ? "Close table of contents" : "Open table of contents"
            }
            className="flex w-full items-center justify-between gap-3 px-4 py-3"
          >
            <span className="relative min-w-0 flex-1 overflow-hidden text-left">
              {/* mode="wait" + y-slide = each new section title "rolls in"
                  from below as the old one exits upward, ticker-style.
                  Keyed by activeId so it only animates on actual change. */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={activeItem?.id ?? "start"}
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="block truncate text-[11px] text-text-highlight"
                >
                  {activeItem?.text ?? "On this page"}
                </motion.span>
              </AnimatePresence>
            </span>

            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-foreground/40"
            >
              <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            </motion.span>
          </button>

          {/* ── Reading progress: hairline along the bar's bottom edge.
              scaleX from a spring-smoothed 0→1; origin-left so it grows
              rightward. Transform, not width, so it never causes layout. */}
          <div className="h-0.5 w-full bg-foreground/10">
            <motion.div
              className="h-full origin-left bg-text-highlight"
              style={{ scaleX: progress }}
            />
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

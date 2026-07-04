// components/home/content/like-button.tsx
//
// ─── COMPACT SIDEBAR VERSION ─────────────────────────────────────────────────
//
// One row that lives under the table of contents:
//
//   [♥] Like 12                            Scroll to top ↑
//
// Same mechanics as before (Josh Comeau style): the heart fills a fifth per
// click, capped at 5 per visitor (enforced server-side by hashed IP), rapid
// clicks are batched into one request, updates are optimistic, and the 5th
// click fires a burst of hearts. Each click plays the same subtle
// interaction sound as the contact form.
//
// The heart sits in a small chip styled after the ContactForm's surface:
// bg-text-highlight/4 with a hairline text-highlight border, warming
// slightly on hover like the form's send button.
//
// The heart itself uses its own accent — --highlight: #ff003c — set as a
// CSS variable on the wrapper, so it's independent of the site-wide
// text-highlight token. If you later promote --highlight to :root in your
// globals.css, just delete the inline style here and it keeps working.
//
// Usage (in the blog page's <aside>, below the TOC):
//
//   <TableOfContents items={toc} />
//   <div className="my-5 border-t border-foreground/10" />
//   <LikeButton slug={slug} />
//
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePlaySound } from "@/components/ui/sensory-ui/config/use-play-sound";

const MAX = 5;

/** How long we wait after the last click before sending the batch (ms). */
const FLUSH_DELAY = 600;

/** One celebration particle: randomized flight path + look. */
type Particle = {
  id: number;
  x: number; // horizontal drift in px (negative = left)
  y: number; // how high it flies in px
  scale: number;
  rotate: number; // degrees
  duration: number; // ms
  delay: number; // ms — staggers the burst slightly
};

/** A single heart path, reused for the button and the particles. */
function HeartPath() {
  return (
    <path d="M12 21s-6.716-4.35-9.428-8.286C.6 9.86 1.9 5.5 5.5 4.5c2.06-.573 4.24.36 5.5 2.086 1.26-1.727 3.44-2.66 5.5-2.086 3.6 1 4.9 5.36 2.928 8.214C18.716 16.65 12 21 12 21z" />
  );
}

export default function LikeButton({ slug }: { slug: string }) {
  const [total, setTotal] = useState<number | null>(null); // null = loading
  const [userLikes, setUserLikes] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popping, setPopping] = useState(false); // scale "pop" on each click

  // Hooks must be called at the component's top level (never inside
  // handlers) — we grab `play` here and call it wherever we like.
  const { play } = usePlaySound({ sound: "interaction.subtle" });
  const { play: playSuccess } = usePlaySound({ sound: "notification.success" });

  // Clicks not yet sent to the server, and the timer that will flush them.
  const pending = useRef(0);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load the current state on mount ───────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/likes/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setTotal(data.total);
        setUserLikes(data.userLikes);
      })
      .catch(() => {
        // If the API is down, render an empty heart at 0 —
        // a like button should never break the page.
        if (!cancelled) setTotal(0);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // ── Send whatever clicks have accumulated ─────────────────────────────────
  function flush() {
    const count = pending.current;
    pending.current = 0;
    if (count === 0) return;

    fetch(`/api/likes/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("save failed");
        return res.json();
      })
      .then((data) => {
        // Reconcile with the server's truth — quietly fixes any drift
        // from optimistic updates (other visitors, other tabs, the cap...)
        setTotal(data.total);
        setUserLikes(data.userLikes);
      })
      .catch(() => {
        // Network/storage failed: roll the optimistic update back so the
        // UI doesn't lie about likes that were never saved.
        setUserLikes((u) => Math.max(0, u - count));
        setTotal((t) => (t === null ? t : Math.max(0, t - count)));
      });
  }

  // Flush any unsent clicks if the reader navigates away mid-batch.
  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── The celebration 🎉 ─────────────────────────────────────────────────────
  function celebrate() {
    // Skip the fireworks entirely for reduced-motion users.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    playSuccess();

    // ~12 hearts fanning upward-outward with randomized everything.
    const burst: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100, // -50px … +50px sideways
      y: 30 + Math.random() * 60, //  30px … 90px upward
      scale: 0.4 + Math.random() * 0.6,
      rotate: (Math.random() - 0.5) * 60,
      duration: 700 + Math.random() * 500,
      delay: Math.random() * 150,
    }));
    setParticles(burst);

    // Clean the particles out of the DOM once the longest one has finished.
    const longest = Math.max(...burst.map((p) => p.duration + p.delay));
    setTimeout(() => setParticles([]), longest + 100);
  }

  // ── Click handler ──────────────────────────────────────────────────────────
  function handleClick() {
    if (total === null || userLikes >= MAX) return;

    // Tactile feedback — after the guard, so a maxed heart stays silent
    // (sound and UI should always agree about whether something happened).
    play();

    // 1. Optimistic UI: fill the heart and bump the count immediately.
    const next = userLikes + 1;
    setUserLikes(next);
    setTotal((t) => (t ?? 0) + 1);

    // 2. Little scale "pop" for tactile feedback on every click.
    setPopping(true);
    setTimeout(() => setPopping(false), 200);

    // 3. Queue the click and (re)start the batch timer.
    pending.current += 1;
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, FLUSH_DELAY);

    // 4. The big moment: 5th like → heart burst.
    if (next === MAX) celebrate();
  }

  // ── Scroll to top ──────────────────────────────────────────────────────────
  function scrollToTop() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  // 0 → 1: how full the heart is. Drives the clip-path below.
  const fill = userLikes / MAX;
  const maxed = userLikes >= MAX;

  return (
    // The wrapper defines --highlight so every color inside can reference it.
    <div
      className="flex items-center justify-between"
      style={{ "--highlight": "#ff003c" } as React.CSSProperties}
    >
      {/* The @keyframes for the particle flight. Each particle reads its
          own CSS variables, so one rule animates all of them. */}
      <style>{`
        @keyframes like-burst {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(var(--s)) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--x), calc(var(--y) * -1))
              scale(calc(var(--s) * 0.6)) rotate(var(--r));
          }
        }
      `}</style>

      {/* ── Left: [heart chip] + "Like" + total ── */}
      <button
        type="button"
        onClick={handleClick}
        disabled={total === null || maxed}
        aria-label={
          maxed
            ? "You've given all 5 likes — thank you!"
            : `Like this post (${userLikes} of ${MAX} given)`
        }
        className={cn(
          "group flex items-center gap-2",
          maxed ? "cursor-default" : "cursor-pointer",
        )}
      >
        {/* Chip around the heart, borrowed from the ContactForm's surface:
            the same text-highlight/4 wash and a hairline border from the
            same alpha ramp, warming slightly on hover like the form's
            send button. No overflow-hidden — the celebration hearts are
            meant to fly past the chip's edges. */}
        <div
          className={cn(
            "flex items-center justify-center rounded-lg p-1.5",
            "border border-text-highlight/10 bg-text-highlight/4",
            "transition-colors duration-300",
            !maxed &&
              "group-hover:border-text-highlight/20 group-hover:bg-text-highlight/10",
            // At 5/5 the border picks up the heart's red instead.
            // (Tailwind v4 syntax — on v3 use "border-[#ff003c33]".)
            maxed && "border-[color:var(--highlight)]/20",
          )}
        >
          {/* The heart: outline underneath, solid --highlight heart on top,
              revealed bottom-up by an animated clip-path inset. */}
          <span
            className={cn(
              "relative block h-4 w-4 transition-transform duration-200",
              popping && "motion-safe:scale-125",
              !maxed && "group-hover:scale-110 group-active:scale-95",
            )}
          >
            {/* Celebration particles, launched from the heart's center. */}
            {particles.map((p) => (
              <span
                key={p.id}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 text-[color:var(--highlight)]"
                style={
                  {
                    "--x": `${p.x}px`,
                    "--y": `${p.y}px`,
                    "--s": p.scale,
                    "--r": `${p.rotate}deg`,
                    animation: `like-burst ${p.duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${p.delay}ms both`,
                  } as React.CSSProperties
                }
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <HeartPath />
                </svg>
              </span>
            ))}

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className={cn(
                "absolute inset-0 h-full w-full transition-colors duration-300",
                maxed
                  ? "text-[color:var(--highlight)]"
                  : "text-foreground/40 group-hover:text-foreground/70",
              )}
            >
              <HeartPath />
            </svg>
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={cn(
                "absolute inset-0 h-full w-full text-[color:var(--highlight)]",
                "motion-safe:transition-[clip-path] motion-safe:duration-500 motion-safe:ease-out",
                // At 5/5, a faint red glow (rgba of #ff003c at 50%).
                maxed && "drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]",
              )}
              style={{
                // fill = 0 → inset(100% …) = hidden; fill = 1 → inset(0) = full
                clipPath: `inset(${(1 - fill) * 100}% 0 0 0)`,
              }}
            >
              <HeartPath />
            </svg>
          </span>
        </div>

        <span
          className={cn(
            "text-[11px] transition-colors duration-300",
            maxed
              ? "text-[color:var(--highlight)]"
              : "text-foreground/45 group-hover:text-foreground/70",
          )}
        >
          {maxed ? "Liked" : "Like"}
        </span>

        {/* Total count — "…" while loading, then live tally. */}
        <span className="text-[11px] tabular-nums text-foreground/30">
          {total === null ? "…" : total.toLocaleString()}
        </span>
      </button>

      {/* ── Right: scroll to top ── */}
      <button
        type="button"
        onClick={scrollToTop}
        className="flex items-center gap-1 text-[11px] text-foreground/45 transition-colors hover:text-text-highlight"
      >
        Scroll to top
        <ArrowUp className="h-3 w-3" />
      </button>
    </div>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";

const MAX = 5;
const FLUSH_DELAY = 600;

type Particle = {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotate: number;
  duration: number;
  delay: number;
};

function HeartPath() {
  return (
    <path d="M12 21s-6.716-4.35-9.428-8.286C.6 9.86 1.9 5.5 5.5 4.5c2.06-.573 4.24.36 5.5 2.086 1.26-1.727 3.44-2.66 5.5-2.086 3.6 1 4.9 5.36 2.928 8.214C18.716 16.65 12 21 12 21z" />
  );
}

export default function LikeButton({ slug }: { slug: string }) {
  const [total, setTotal] = useState<number | null>(null);
  const [userLikes, setUserLikes] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [popping, setPopping] = useState(false);

  const playSuccess = useSound(retro.success);
  const playInteraction = useSound(retro.tap);

  const pending = useRef(0);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        if (!cancelled) setTotal(0);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

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
        setTotal(data.total);
        setUserLikes(data.userLikes);
      })
      .catch(() => {
        setUserLikes((u) => Math.max(0, u - count));
        setTotal((t) => (t === null ? t : Math.max(0, t - count)));
      });
  }

  useEffect(() => {
    return () => {
      if (flushTimer.current) clearTimeout(flushTimer.current);
      flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    playSuccess();

    const burst: Particle[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 100,
      y: 30 + Math.random() * 60,
      scale: 0.4 + Math.random() * 0.6,
      rotate: (Math.random() - 0.5) * 60,
      duration: 700 + Math.random() * 500,
      delay: Math.random() * 150,
    }));
    setParticles(burst);

    const longest = Math.max(...burst.map((p) => p.duration + p.delay));
    setTimeout(() => setParticles([]), longest + 100);
  }

  function handleClick() {
    if (total === null || userLikes >= MAX) return;

    playInteraction();

    const next = userLikes + 1;
    setUserLikes(next);
    setTotal((t) => (t ?? 0) + 1);

    setPopping(true);
    setTimeout(() => setPopping(false), 200);

    pending.current += 1;
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(flush, FLUSH_DELAY);

    if (next === MAX) celebrate();
  }

  function scrollToTop() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  const fill = userLikes / MAX;
  const maxed = userLikes >= MAX;

  return (
    <div
      className="flex items-center justify-between"
      style={{ "--highlight": "#ff003c" } as React.CSSProperties}
    >
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
        <div
          className={cn(
            "flex items-center justify-center rounded-lg p-1.5",
            "border border-text-highlight/10 bg-text-highlight/4",
            "transition-colors duration-300",
            !maxed &&
              "group-hover:border-text-highlight/20 group-hover:bg-text-highlight/10",

            maxed && "border-[color:var(--highlight)]/20",
          )}
        >
          <span
            className={cn(
              "relative block h-4 w-4 transition-transform duration-200",
              popping && "motion-safe:scale-125",
              !maxed && "group-hover:scale-110 group-active:scale-95",
            )}
          >
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

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SeriesPart = { slug: string; title: string };

type SeriesCardProps = {
  series: { slug: string; title: string };
  part: number; // 1-indexed
  total: number;
  /**
   * Ordered list of all posts in the series. Optional — if provided,
   * the progress segments become links and prev/next navigation appears.
   */
  parts?: SeriesPart[];
};

const postHref = (slug: string) => `/blog/${slug}`;

export default function SeriesCard({
  series,
  part,
  total,
  parts,
}: SeriesCardProps) {
  const prev = parts?.[part - 2];
  const next = parts?.[part];

  return (
    // ContactForm's soft text-highlight/4 wash, plus a backdrop blur and
    // hairline border: the card sits over page content in the sticky
    // sidebar, so it needs a defined edge and a frosted backdrop to stay
    // readable while things scroll behind it.
    <div className="mb-6 rounded-xl border border-foreground/10 bg-text-highlight/4 p-3 backdrop-blur-md">
      <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
        Series · Part {part} of {total}
      </span>

      <Link
        href={`/series/${series.slug}`}
        className="group mt-1 flex items-center justify-between gap-2"
      >
        <p className="truncate text-xs font-medium text-text-highlight">
          {series.title}
        </p>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-foreground/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-text-highlight" />
      </Link>

      {/* Progress: one segment per part — dim behind you, solid where
          you are, faint ahead. Flat colors, no shadows. */}
      <div className="mt-3 flex gap-1" aria-label={`Part ${part} of ${total}`}>
        {Array.from({ length: total }, (_, i) => {
          const state =
            i + 1 < part ? "done" : i + 1 === part ? "current" : "upcoming";
          const seg = (
            <span
              className={cn(
                "block h-0.5 w-full rounded-full transition-colors duration-300",
                state === "done" && "bg-text-highlight/40",
                state === "current" && "bg-text-highlight",
                state === "upcoming" && "bg-foreground/10",
              )}
            />
          );
          const target = parts?.[i];
          return target && state !== "current" ? (
            <Link
              key={target.slug}
              href={postHref(target.slug)}
              title={target.title}
              // py-1/-my-1 pads the hit area without changing the layout —
              // a 2px-tall line is an unfair click target otherwise.
              className="group/seg -my-1 flex-1 py-1"
            >
              <span className="block transition-opacity group-hover/seg:opacity-70">
                {seg}
              </span>
            </Link>
          ) : (
            <span key={i} className="flex-1">
              {seg}
            </span>
          );
        })}
      </div>

      {/* Prev / next — only rendered when the parts list is available.
          Same quiet-text-that-warms-on-hover treatment as the blog list. */}
      {(prev || next) && (
        <div className="mt-3 flex items-center justify-between border-t border-foreground/10 pt-2 text-[10px]">
          {prev ? (
            <Link
              href={postHref(prev.slug)}
              title={prev.title}
              className="flex items-center gap-1 text-foreground/45 transition-colors hover:text-text-highlight"
            >
              <ChevronLeft className="h-3 w-3" />
              Previous
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={postHref(next.slug)}
              title={next.title}
              className="flex items-center gap-1 text-foreground/45 transition-colors hover:text-text-highlight"
            >
              Next
              <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

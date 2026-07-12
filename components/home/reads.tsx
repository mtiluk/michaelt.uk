"use client";
import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import { cn } from "@/lib/utils";
import type { Read, ReadType } from "@/lib/reads";

const SEARCH_THRESHOLD = 4;
const PER_PAGE = 4;

const TYPE_FILTERS: { id: ReadType | null; label: string }[] = [
  { id: null, label: "All" },
  { id: "book", label: "Books" },
  { id: "article", label: "Articles" },
  { id: "blog", label: "Blogs" },
];

function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 21s-6.716-4.35-9.428-8.286C.6 9.86 1.9 5.5 5.5 4.5c2.06-.573 4.24.36 5.5 2.086 1.26-1.727 3.44-2.66 5.5-2.086 3.6 1 4.9 5.36 2.928 8.214C18.716 16.65 12 21 12 21z" />
    </svg>
  );
}

function ReadItem({ read }: { read: Read }) {
  return (
    <a href={read.url} target="_blank" rel="noopener noreferrer" className="group block w-full rounded-lg pt-3 transition-colors last:border-b-0 hover:bg-foreground/10" >
      <div className="mx-auto max-w-136 border-b border-foreground/10 pb-3 transition-colors group-hover:border-transparent group-last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <span className="flex min-w-0 items-center gap-1.5">
              <h3 className="truncate text-[13px] font-medium leading-tight text-text-highlight">
                {read.title}
              </h3>
              {read.favorite && (
                <Heart className="h-3 w-3 shrink-0 text-[#ff003c]" />
              )}
            </span>
            {read.note && (
              <p className="mt-1 truncate text-[11px] text-foreground/55">
                {read.note}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <span className="text-[11px] text-foreground/30 transition-colors group-hover:text-foreground/50">
              {read.source}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/25">
              {read.type}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function EmptyState({ message }: { message: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-136 text-center">
      <div className="w-full border-t border-dashed border-foreground/20" />
      <pre aria-hidden className="my-2 text-[10px] leading-3 text-foreground/20">
{` .-.
(o o)  ?
| O \\
|   \\
'~~~'`}
      </pre>
      <p className="mb-2 text-[10px] text-foreground/40">{message}</p>
      <div className="w-full border-b border-dashed border-foreground/20" />
    </div>
  );
}

const chipClass = (active: boolean) =>
  cn(
    "rounded-full border px-2.5 py-0.5 text-[11px] transition-colors",
    active
      ? "border-text-highlight/20 bg-text-highlight/10 text-text-highlight"
      : "border-foreground/10 text-foreground/45 hover:border-foreground/20 hover:text-foreground/70",
  );

export default function Reads({ reads }: { reads: Read[] }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ReadType | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const playKey = useSound(retro.keyPress);
  const playSelect = useSound(retro.select);
  const playToggle = useSound(retro.toggleOn);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reads.filter((read) => {
      if (activeType && read.type !== activeType) return false;
      if (favoritesOnly && !read.favorite) return false;
      if (!q) return true;
      return (
        read.title.toLowerCase().includes(q) ||
        read.author?.toLowerCase().includes(q) ||
        read.note?.toLowerCase().includes(q) ||
        read.source.toLowerCase().includes(q)
      );
    });
  }, [reads, query, activeType, favoritesOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  function goToPage(next: number) {
    playSelect();
    setPage(next);
    topRef.current?.scrollIntoView({ block: "nearest" });
  }

  if (reads.length === 0) {
    return <EmptyState message="Nothing read yet, apparently" />;
  }

  const showSearch = reads.length >= SEARCH_THRESHOLD;
  const filtering = query || activeType || favoritesOnly;

  return (
    <div ref={topRef} className="scroll-mt-24">
      {showSearch && (
        <div className="mx-auto mb-2 max-w-136">
          <div className="flex items-center gap-2 rounded-lg bg-text-highlight/4 px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-foreground/30" aria-hidden />

            <input type="search" value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
                playKey();
              }}
              placeholder="Search reads…"
              aria-label="Search reads"
              className="w-full bg-transparent text-[12px] text-text-highlight outline-none placeholder:text-foreground/25"
            />

            {filtering && (
              <span className="shrink-0 font-mono text-[10px] tabular-nums text-foreground/30">
                {filtered.length}/{reads.length}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {TYPE_FILTERS.map((filter) => {
              const active = activeType === filter.id;
              return (
                <button
                  key={filter.label}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    if (active) return;
                    playSelect();
                    setActiveType(filter.id);
                    setPage(1);
                  }}
                  className={chipClass(active)}
                >
                  {filter.label}
                </button>
              );
            })}

            <button
              type="button"
              aria-pressed={favoritesOnly}
              aria-label="Favorites only"
              onClick={() => {
                playToggle();
                setFavoritesOnly((v) => !v);
                setPage(1);
              }}
              className={cn(
                chipClass(favoritesOnly),
                "ml-auto flex items-center gap-1",
                favoritesOnly &&
                  "border-[#ff003c]/20 bg-[#ff003c]/10 text-[#ff003c]",
              )}
            >
              <Heart className="h-2.5 w-2.5" />
              Favorites
            </button>
          </div>
        </div>
      )}

      {pageItems.length === 0 ? (
        <EmptyState message="Nothing matches that" />
      ) : (
        pageItems.map((read) => <ReadItem key={read.url} read={read} />)
      )}

      {totalPages > 1 && (
        <div className="mx-auto mt-4 flex max-w-136 items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "flex items-center gap-1 transition-colors",
              currentPage === 1
                ? "cursor-default text-foreground/20"
                : "text-foreground/45 hover:text-text-highlight",
            )}
          >
            <ChevronLeft className="h-3 w-3" aria-hidden />
            Prev
          </button>

          <span className="font-mono text-[10px] tabular-nums text-foreground/40">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "flex items-center gap-1 transition-colors",
              currentPage === totalPages
                ? "cursor-default text-foreground/20"
                : "text-foreground/45 hover:text-text-highlight",
            )}
          >
            Next
            <ChevronRight className="h-3 w-3" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

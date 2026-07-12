"use client";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/blogs";


const SEARCH_THRESHOLD = 4;
const PER_PAGE = 4

function BlogItem({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group block w-full rounded-lg pt-3 transition-colors last:border-b-0 hover:bg-foreground/10"
    >
      <div className="mx-auto max-w-136 border-b border-foreground/10 pb-3 transition-colors group-hover:border-transparent group-last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-medium leading-tight text-text-highlight">
              {blog.title}
            </h3>
            <p className="mt-1 truncate text-[11px] text-foreground/55">
              {blog.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <time
              dateTime={blog.publishedAt}
              className="text-[11px] text-foreground/30 transition-colors group-hover:text-foreground/50"
            >
              {blog.publishedAt}
            </time>
            <span className="text-[10px] text-foreground/25">
              {blog.timeToRead}
            </span>
          </div>
        </div>
      </div>
    </Link>
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

export default function Blogs({ blogs }: { blogs: Blog[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const playKey = useSound(retro.keyPress);
  const playSelect = useSound(retro.select);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(q) ||
        blog.description?.toLowerCase().includes(q),
    );
  }, [blogs, query]);

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

  if (blogs.length === 0) {
    return <EmptyState message="No blogs yet" />;
  }

  const showSearch = blogs.length >= SEARCH_THRESHOLD;


  return (
    <div ref={topRef} className="scroll-mt-24">
      {showSearch && (
        <div className="mx-auto mb-2 flex max-w-136 items-center gap-2 rounded-lg bg-text-highlight/4 px-3 py-2">
          <Search className="h-3.5 w-3.5 shrink-0 text-foreground/30" aria-hidden />

          <input type="search" value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              playKey();
            }}
            placeholder="Search blogs…"
            aria-label="Search blogs"
            className="w-full bg-transparent text-[12px] text-text-highlight outline-none placeholder:text-foreground/25"
          />

          {query && (
            <span className="shrink-0 font-mono text-[10px] tabular-nums text-foreground/30">
              {filtered.length}/{blogs.length}
            </span>
          )}
        </div>
      )}

      {pageItems.length === 0 ? (
        <EmptyState message={<>Nothing matches &ldquo;{query}&rdquo;</>} />
      ) : (
        pageItems.map((blog) => <BlogItem key={blog.slug} blog={blog} />)
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
            Newer
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
            Older
            <ChevronRight className="h-3 w-3" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}

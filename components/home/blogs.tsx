"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSound } from "@/lib/audio";
import { cn } from "@/lib/utils";
import type { Blog } from "@/types/blogs";
import EmptyState from "@/components/ui/empty-state";
import { HoverHighlight, useHoverHighlight } from "@/components/ui/hover-highlight";
import { formatDate } from "@/lib/dates";

const PER_PAGE = 4;

function BlogItem({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      data-blog-item
      className="group relative block w-full rounded-lg pt-4 transition-colors last:border-b-0"
    >
      <div className="mx-auto max-w-136 border-b border-foreground/10 pb-4 transition-colors group-hover:border-transparent group-last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-[13px] font-medium leading-tight text-text-highlight">
              {blog.title}
            </h3>
            <p className="mt-1.5 truncate text-[11px] text-foreground/55">
              {blog.description}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <time
              dateTime={blog.publishedAt}
              className="text-[11px] text-foreground/30 transition-colors group-hover:text-foreground/50"
            >
              {formatDate(blog.publishedAt)}
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

export default function Blogs({ blogs }: { blogs: Blog[] }) {
  const [page, setPage] = useState(1);
  const highlight = useHoverHighlight("data-blog-item");
  const topRef = useRef<HTMLDivElement>(null);

  const playSelect = useSound("select");

  const totalPages = Math.max(1, Math.ceil(blogs.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = blogs.slice(
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

  return (
    <div ref={topRef} className="scroll-mt-24">
      <HoverHighlight highlight={highlight}>
        {pageItems.map((blog) => <BlogItem key={blog.slug} blog={blog} />)}
      </HoverHighlight>

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

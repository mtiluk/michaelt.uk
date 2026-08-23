"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import type { SearchGroup, SearchItem } from "@/lib/search";

const GROUP_ORDER: SearchGroup[] = ["Pages", "Blog", "Projects", "Reads", "Social"];

function score(item: SearchItem, query: string) {
  const haystack = `${item.title} ${item.subtitle ?? ""} ${item.group}`.toLowerCase();
  const index = haystack.indexOf(query);
  if (index === -1) return -1;
  return item.title.toLowerCase().startsWith(query) ? 0 : index + 1;
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded bg-foreground/8 px-1 py-0.5 font-sans text-[9px] leading-none text-foreground/40">
      {children}
    </kbd>
  );
}

export default function CommandPalette({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const playOpen = useSound(retro.expand);
  const playMove = useSound(retro.select);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const matched = trimmed
      ? items
          .map((item) => ({ item, rank: score(item, trimmed) }))
          .filter((entry) => entry.rank >= 0)
          .sort((a, b) => a.rank - b.rank)
          .map((entry) => entry.item)
      : items;

    return matched.slice(0, 30);
  }, [items, query]);

  const grouped = useMemo(() => {
    const buckets = new Map<SearchGroup, SearchItem[]>();
    for (const item of results) {
      const bucket = buckets.get(item.group) ?? [];
      bucket.push(item);
      buckets.set(item.group, bucket);
    }
    return GROUP_ORDER.filter((group) => buckets.has(group)).map((group) => ({
      group,
      items: buckets.get(group) as SearchItem[],
    }));
  }, [results]);

  const flat = useMemo(() => grouped.flatMap((section) => section.items), [grouped]);

  const select = useCallback(
    (item: SearchItem) => {
      setOpen(false);
      if (item.external) {
        window.open(item.href, "_blank", "noopener,noreferrer");
        return;
      }
      router.push(item.href);
    },
    [router],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((value) => {
          if (!value) playOpen();
          return !value;
        });
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [playOpen]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
      e.preventDefault();
      if (flat.length === 0) return;
      playMove();
      setActive((value) => (value + 1) % flat.length);
      return;
    }
    if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
      e.preventDefault();
      if (flat.length === 0) return;
      playMove();
      setActive((value) => (value - 1 + flat.length) % flat.length);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[active];
      if (item) select(item);
    }
  }

  const activeItem = flat[active];
  let cursor = -1;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-5 pt-[16vh]"
          >
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-[3px]"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, filter: "blur(6px)" }}
              transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
              className="relative flex w-full max-w-136 flex-col overflow-hidden rounded-xl bg-background/80 shadow-2xl shadow-black/30 ring-1 ring-foreground/10 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-2.5 px-3.5 pt-3 pb-2.5">
                <Search className="h-3.5 w-3.5 shrink-0 text-foreground/25" aria-hidden />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Type a command or search..."
                  aria-label="Search"
                  className="w-full bg-transparent text-[13px] leading-5 text-text-highlight outline-hidden placeholder:text-foreground/25"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="shrink-0 cursor-pointer rounded text-foreground/25 transition-colors hover:text-text-highlight focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/40"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>

              <div ref={listRef} className="max-h-72 overflow-y-auto px-1.5 pb-1.5">
                {flat.length === 0 ? (
                  <p className="px-2 py-8 text-center text-[12px] text-foreground/30">
                    No matches
                  </p>
                ) : (
                  grouped.map((section) => (
                    <div key={section.group}>
                      <p className="px-2.5 pt-2.5 pb-1 text-[10px] tracking-wider text-foreground/25 uppercase">
                        {section.group}
                      </p>
                      {section.items.map((item) => {
                        cursor += 1;
                        const index = cursor;
                        const isActive = index === active;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            data-active={isActive}
                            onMouseMove={() => setActive(index)}
                            onClick={() => select(item)}
                            className={`flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors duration-150 ${
                              isActive ? "bg-text-highlight/6" : ""
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span
                                className={`block truncate text-[12px] leading-5 transition-colors ${
                                  isActive ? "text-text-highlight" : "text-foreground/70"
                                }`}
                              >
                                {item.title}
                              </span>
                              {item.subtitle && (
                                <span className="block truncate text-[11px] leading-4 text-foreground/30">
                                  {item.subtitle}
                                </span>
                              )}
                            </span>
                            {item.external && (
                              <ArrowUpRight
                                className={`h-3 w-3 shrink-0 transition-colors ${
                                  isActive ? "text-text-highlight/50" : "text-foreground/15"
                                }`}
                                aria-hidden
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center gap-3 border-t border-foreground/5 px-3.5 py-2 text-[10px] text-foreground/25">
                <span className="flex items-center gap-1">
                  <Key>↑↓</Key> navigate
                </span>
                <span className="flex items-center gap-1">
                  <Key>↵</Key>
                  {activeItem?.external ? "open in new tab" : "go to page"}
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <Key>esc</Key> close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

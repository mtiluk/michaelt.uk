"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";
import { useActiveHeading } from "./use-active-heading";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const activeId = useActiveHeading(items);
  return <TocList items={items} activeId={activeId} />;
}

export function TocList({ items, activeId }: { items: TocItem[]; activeId: string }) {
  const listRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map());
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  useEffect(() => {
    if (!activeId) return;
    const measure = () => {
      const link = linkRefs.current.get(activeId);
      const list = listRef.current;
      if (!link || !list) return;
      const linkRect = link.getBoundingClientRect();
      const listRect = list.getBoundingClientRect();
      setIndicator({
        top: linkRect.top - listRect.top,
        height: linkRect.height,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeId, items]);

  if (items.length === 0) return null;

  const activeIndex = items.findIndex((item) => item.id === activeId);
  const readProgress =
    activeIndex >= 0 ? indicator.top + indicator.height : 0;

  return (
    <nav aria-label="Table of contents">
      <p className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
        On this page
      </p>
      <ul ref={listRef} className="relative mt-3 space-y-2 text-[11px]">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-px bg-foreground/10"
        />
        <div
          aria-hidden
          className="absolute left-0 top-0 w-px bg-text-highlight/25 motion-safe:transition-[height] motion-safe:duration-500 motion-safe:ease-out"
          style={{ height: readProgress }}
        />
        <div
          aria-hidden
          className="absolute left-0 w-0.5 translate-x-[-0.5px] rounded-full bg-text-highlight shadow-[0_0_8px_--theme(--color-text-highlight/40)] motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out"
          style={{ top: indicator.top, height: indicator.height }}
        />
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id}>
              <a
                ref={(el) => {
                  if (el) linkRefs.current.set(item.id, el);
                  else linkRefs.current.delete(item.id);
                }}
                href={`#${item.id}`}
                className={cn(
                  "block leading-snug transition-colors duration-200",
                  item.level === 3 ? "pl-6" : "pl-3.5",
                  active
                    ? "text-text-highlight"
                    : "text-foreground/45 hover:text-foreground/70",
                )}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

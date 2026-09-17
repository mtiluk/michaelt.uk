"use client";
import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

const BOTTOM_OFFSET = 28;

export function useActiveHeading(items: TocItem[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (headings.length === 0) return;

    const passed = new Set<Element>();
    let atBottom = false;

    const update = () => {
      if (atBottom) {
        setActiveId(headings[headings.length - 1].id);
        return;
      }
      const current = headings.findLast((heading) => passed.has(heading)) ?? headings[0];
      setActiveId(current.id);
    };

    const headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) passed.add(entry.target);
          else passed.delete(entry.target);
        }
        update();
      },
      { rootMargin: "100000px 0px -70% 0px" },
    );
    headings.forEach((heading) => headingObserver.observe(heading));

    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    Object.assign(sentinel.style, {
      position: "absolute",
      left: "0",
      bottom: "0",
      width: "1px",
      height: `${BOTTOM_OFFSET}px`,
      pointerEvents: "none",
      visibility: "hidden",
    });
    document.body.appendChild(sentinel);

    const bottomObserver = new IntersectionObserver(([entry]) => {
      atBottom = entry.isIntersecting;
      update();
    });
    bottomObserver.observe(sentinel);

    return () => {
      headingObserver.disconnect();
      bottomObserver.disconnect();
      sentinel.remove();
    };
  }, [items]);

  return activeId;
}

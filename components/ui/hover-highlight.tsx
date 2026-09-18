"use client";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { play } from "@/lib/audio";

const DURATION_MS = 200;

export function useHoverHighlight(itemAttribute: string) {
  const listRef = useRef<HTMLDivElement>(null);
  const current = useRef<HTMLElement | null>(null);
  const [highlight, setHighlight] = useState({ top: 0, height: 0, visible: false, moving: false });

  function move(target: EventTarget, sound = false) {
    const item = (target as HTMLElement).closest<HTMLElement>(`[${itemAttribute}]`);
    if (!item || !listRef.current?.contains(item)) return;
    if (sound && item !== current.current) play("hover");
    current.current = item;
    setHighlight((prev) => ({
      top: item.offsetTop,
      height: item.offsetHeight,
      visible: true,
      moving: prev.visible,
    }));
  }

  function hide() {
    current.current = null;
    setHighlight((prev) => ({ ...prev, visible: false, moving: false }));
  }

  return { listRef, highlight, move, hide };
}

type HoverHighlightProps = {
  children: ReactNode;
  highlight: ReturnType<typeof useHoverHighlight>;
  className?: string;
};

export function HoverHighlight({ children, highlight, className }: HoverHighlightProps) {
  const { listRef, highlight: state, move, hide } = highlight;

  return (
    <div
      ref={listRef}
      className={cn("relative", className)}
      onPointerOver={(e) => move(e.target, e.pointerType === "mouse")}
      onPointerLeave={hide}
      onFocus={(e) => move(e.target)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 rounded-lg bg-foreground/10 ease-out motion-reduce:transition-none"
        style={{
          top: state.top,
          height: state.height,
          opacity: state.visible ? 1 : 0,
          transitionProperty: state.moving ? "top, height, opacity" : "opacity",
          transitionDuration: `${DURATION_MS}ms`,
        }}
      />
      {children}
    </div>
  );
}

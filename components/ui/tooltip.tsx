"use client";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { play } from "@/lib/audio";

type TooltipSide = "top" | "right" | "bottom" | "left";

type TooltipProps = {
  children: ReactNode;
  content: ReactNode;
  side?: TooltipSide;
  gap?: number;
  delay?: number;
  sound?: boolean;
  className?: string;
};

const MARGIN = 8;
const OPPOSITE: Record<TooltipSide, TooltipSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const ENTER: Record<TooltipSide, string> = {
  top: "translate(-50%, 4px)",
  bottom: "translate(-50%, -4px)",
  left: "translate(4px, -50%)",
  right: "translate(-4px, -50%)",
};

const RESTING: Record<TooltipSide, string> = {
  top: "translate(-50%, 0)",
  bottom: "translate(-50%, 0)",
  left: "translate(0, -50%)",
  right: "translate(0, -50%)",
};

function fits(side: TooltipSide, trigger: DOMRect, tip: DOMRect, gap: number) {
  if (side === "top") return trigger.top - tip.height - gap >= MARGIN;
  if (side === "bottom") return trigger.bottom + tip.height + gap <= window.innerHeight - MARGIN;
  if (side === "left") return trigger.left - tip.width - gap >= MARGIN;
  return trigger.right + tip.width + gap <= window.innerWidth - MARGIN;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export default function Tooltip({ children, content, side = "top", gap = 8, delay = 120, sound = true, className }: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [placement, setPlacement] = useState({ top: 0, left: 0, side });

  const position = useCallback(() => {
    const tipNode = tipRef.current;
    const trigger = triggerRef.current?.getBoundingClientRect();
    const tip = tipNode?.getBoundingClientRect();
    if (!trigger || !tip || !tipNode) return;

    // Rects are in zoom-scaled viewport pixels, but top/left are read back
    // inside the zoomed page, so convert with the element's own scale.
    const scale = tipNode.offsetWidth ? tip.width / tipNode.offsetWidth : 1;

    let next = side;
    if (!fits(next, trigger, tip, gap) && fits(OPPOSITE[next], trigger, tip, gap)) {
      next = OPPOSITE[next];
    }

    const vertical = next === "top" || next === "bottom";
    const top = vertical
      ? next === "top"
        ? trigger.top - tip.height - gap
        : trigger.bottom + gap
      : clamp(trigger.top + trigger.height / 2 - tip.height / 2, MARGIN, window.innerHeight - tip.height - MARGIN);
    const left = vertical
      ? clamp(trigger.left + trigger.width / 2 - tip.width / 2, MARGIN, window.innerWidth - tip.width - MARGIN)
      : next === "left"
        ? trigger.left - tip.width - gap
        : trigger.right + gap;

    setPlacement({
      top: top / scale,
      left: (vertical ? left + tip.width / 2 : left) / scale,
      side: next,
    });
  }, [gap, side]);

  useLayoutEffect(() => {
    if (!open) return;
    position();
    const frame = requestAnimationFrame(() => setShown(true));
    const update = () => position();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, position]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setShown(false);
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    if (timer.current) clearTimeout(timer.current);
    setShown(false);
    setOpen(false);
  }

  const vertical = placement.side === "top" || placement.side === "bottom";

  const bubble = (
    <div
      ref={tipRef}
      id={id}
      role="tooltip"
      className={cn(
        "pointer-events-none fixed z-50 max-w-60 rounded-lg border border-foreground/15 bg-background px-2 py-1 text-[11px] leading-snug text-text-highlight shadow-lg shadow-black/30",
        "transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
        className,
      )}
      style={{
        top: placement.top,
        left: placement.left,
        opacity: shown ? 1 : 0,
        transform: shown ? RESTING[placement.side] : ENTER[placement.side],
        transformOrigin: vertical ? "center" : placement.side === "left" ? "right" : "left",
      }}
    >
      {content}
    </div>
  );

  return (
    <>
      <span
        ref={triggerRef}
        aria-describedby={open ? id : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType !== "mouse") return;
          if (sound) play("hover");
          show();
        }}
        onPointerLeave={hide}
        onFocusCapture={show}
        onBlurCapture={hide}
        className="inline"
      >
        {children}
      </span>

      {open && createPortal(bubble, document.body)}
    </>
  );
}

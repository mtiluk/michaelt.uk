"use client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import SocialCard from "./card";
import { REGISTRY } from "./registry";
import type { Social } from "@/types/socials";

const DURATION = 300;
const EASE = "cubic-bezier(0.33, 1, 0.68, 1)";
const TRAVEL = 200;

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

const content = {
  enter: (direction: number) => ({ opacity: 0, x: TRAVEL * direction, filter: "blur(2px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (direction: number) => ({ opacity: 0, x: TRAVEL * -direction, filter: "blur(2px)" }),
};

export default function SocialLinks({ socials }: { socials: Social[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [renderId, setRenderId] = useState(0);
  const [box, setBox] = useState({ left: 0, width: 0, height: 0, animated: false });

  const instant = useRef(true);
  const previous = useRef(0);
  const pendingLeft = useRef(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const play = useSound(retro.hover);

  function show(node: HTMLAnchorElement, next: number) {
    instant.current = !open;
    pendingLeft.current = node.offsetLeft + node.offsetWidth / 2;

    setDirection(instant.current ? 0 : Math.sign(next - previous.current));
    previous.current = next;
    setIndex(next);
    setRenderId((id) => id + 1);
    setOpen(true);
  }

  useIsomorphicLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const width = node.offsetWidth;
    const height = node.offsetHeight;
    if (!width || !height) return;

    setBox({ left: pendingLeft.current, width, height, animated: !instant.current });
  }, [renderId]);

  const active = socials[index];

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="relative flex"
        onMouseLeave={() => setOpen(false)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
      >
        {socials.map((social, i) => {
          const { icon: Icon, label } = REGISTRY[social.platform];
          return (
            <Link
              key={social.platform}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${label}: @${social.handle}`}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                play();
                show(e.currentTarget, i);
              }}
              onFocus={(e) => show(e.currentTarget, i)}
              className="relative z-10 rounded-md p-1.5 text-[10px] text-foreground transition-colors duration-200 hover:text-text-highlight"
            >
              <Icon />
            </Link>
          );
        })}

        {active && (
          <div
            aria-hidden={!open}
            style={{
              left: box.left,
              width: box.width || "auto",
              height: box.height || "auto",
              translate: "-50% 0",
              opacity: open ? 1 : 0,
              pointerEvents: open ? "auto" : "none",
              transitionProperty: box.animated ? "opacity, left, width, height" : "opacity",
              transitionDuration: `${DURATION}ms`,
              transitionTimingFunction: EASE,
            }}
            className="absolute bottom-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-foreground/20 bg-background shadow-2xl shadow-black/40"
          >
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={renderId}
                ref={(node) => {
                  if (node) contentRef.current = node;
                }}
                custom={direction}
                variants={content}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: DURATION / 1000, ease: [0.33, 1, 0.68, 1] }}
                className="absolute bottom-0 left-0"
              >
                <SocialCard social={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="absolute inset-0 -top-2" />
      </div>
    </MotionConfig>
  );
}

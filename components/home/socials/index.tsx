"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, animate, motion, MotionConfig, useMotionValue, type MotionValue } from "motion/react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import SocialCard from "./card";
import { REGISTRY } from "./registry";
import type { Social } from "@/types/socials";

const DURATION = 0.3;
const EASE = [0.33, 1, 0.68, 1] as const;
const TRAVEL = 200;

const content = {
  enter: (direction: number) => ({
    opacity: 0,
    x: TRAVEL * direction,
    filter: "blur(2px)",
  }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (direction: number) => ({
    opacity: 0,
    x: TRAVEL * -direction,
    filter: "blur(2px)",
  }),
};

export default function SocialLinks({ socials }: { socials: Social[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [renderId, setRenderId] = useState(0);

  const left = useMotionValue(0);
  const width = useMotionValue(0);
  const height = useMotionValue(0);
  const instant = useRef(true);
  const previous = useRef(0);
  const play = useSound(retro.hover);

  function move(value: MotionValue<number>, target: number) {
    if (instant.current) {
      value.jump(target);
      return;
    }
    animate(value, target, { duration: DURATION, ease: EASE });
  }

  function onEnter(e: React.PointerEvent<HTMLAnchorElement>, next: number) {
    if (e.pointerType !== "mouse") return;

    instant.current = !open;
    const node = e.currentTarget;
    move(left, node.offsetLeft + node.offsetWidth / 2);

    setDirection(instant.current ? 0 : Math.sign(next - previous.current));
    previous.current = next;
    setIndex(next);
    setRenderId((id) => id + 1);
    setOpen(true);
  }

  const active = socials[index];

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative flex" onMouseLeave={() => setOpen(false)}>
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
                play();
                onEnter(e, i);
              }}
              onFocus={() => {
                setIndex(i);
                previous.current = i;
                setOpen(true);
              }}
              className="relative z-10 rounded-md p-1.5 text-[10px] text-foreground transition-colors duration-200 hover:text-text-highlight"
            >
              <Icon />
            </Link>
          );
        })}

        <AnimatePresence>
          {open && active && (
            <motion.div
              style={{ left, width, height, x: "-50%" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-[calc(100%+0.5rem)] z-30 overflow-hidden rounded-xl border border-foreground/20 bg-background shadow-2xl shadow-black/40"
            >
              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={renderId}
                  ref={(node) => {
                    if (!node) return;
                    move(width, node.offsetWidth);
                    move(height, node.offsetHeight);
                  }}
                  custom={direction}
                  variants={content}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: DURATION, ease: EASE }}
                  className="absolute bottom-0 left-0"
                >
                  <SocialCard social={active} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 -top-2" />
      </div>
    </MotionConfig>
  );
}

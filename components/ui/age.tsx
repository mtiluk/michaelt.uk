"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, m, MotionConfig } from "motion/react";

const DECIMALS = 9;
const TICK_MS = 100;
const YEAR_MS = 31557600000;
const BLUR = "blur(0.14em)";
const EASE = [0.33, 1, 0.68, 1] as const;

export default function Age({ birth }: { birth: string }) {
  const born = Date.parse(birth);
  const [value, setValue] = useState(() => (Date.now() - born) / YEAR_MS);

  useEffect(() => {
    const timer = setInterval(() => setValue((Date.now() - born) / YEAR_MS), TICK_MS);
    return () => clearInterval(timer);
  }, [born]);

  return (
    <MotionConfig reducedMotion="user">
      <span className="inline-flex h-[1.3em] items-center tabular-nums">
        {value.toFixed(DECIMALS).split("").map((char, i) => (
          <span
            key={i}
            className="relative inline-block h-[1.3em]"
            style={{ width: char === "." ? "0.28em" : "0.56em" }}
          >
            <AnimatePresence initial={false}>
              <m.span
                key={char}
                initial={{ opacity: 0, y: "0.35em", filter: BLUR }}
                animate={{ opacity: 1, y: "0em", filter: "blur(0em)" }}
                exit={{ opacity: 0, y: "-0.35em", filter: BLUR }}
                transition={{ duration: 0.26, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {char}
              </m.span>
            </AnimatePresence>
          </span>
        ))}
      </span>
    </MotionConfig>
  );
}

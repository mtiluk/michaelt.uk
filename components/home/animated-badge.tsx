"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const TITLES = [
  "Design Engineer",
  "UI/UX Designer",
  "Frontend Dev",
  "Creative Coder",
];

const CYCLE_INTERVAL = 2500;

export default function AnimatedBadge() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % TITLES.length);
    }, CYCLE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      layout
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="inline-flex overflow-hidden rounded bg-text-highlight/[0.04] px-2 py-0.5 text-[11px] text-text-highlight/40 whitespace-nowrap"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {TITLES[index]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

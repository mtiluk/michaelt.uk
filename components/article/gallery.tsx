"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import type { ProjectImage } from "@/types/projects";

export default function Gallery({ images }: { images: ProjectImage[] }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) return null;

  const active = images[index];

  return (
    <MotionConfig reducedMotion="user">
      <figure className="mt-6">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10">
          <AnimatePresence initial={false}>
            <motion.div
              key={active.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 768px) 100vw, 544px"
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {images.length > 1 && (
          <div className="mt-2 flex gap-2">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View ${image.alt}`}
                aria-current={i === index}
                className={`relative aspect-video w-16 cursor-pointer overflow-hidden rounded-md bg-foreground-div/40 ring-1 transition-all focus-visible:outline-hidden ${
                  i === index
                    ? "ring-text-highlight/40"
                    : "opacity-50 ring-foreground/10 hover:opacity-80"
                }`}
              >
                <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
        )}

        {active.caption && (
          <figcaption className="mt-2 text-[11px] text-foreground/35">{active.caption}</figcaption>
        )}
      </figure>
    </MotionConfig>
  );
}

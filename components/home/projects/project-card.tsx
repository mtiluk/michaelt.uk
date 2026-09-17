"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Wave from "@/components/ui/wave";
import { usePalette } from "@/components/providers/palette-provider";
import { useSound } from "@/lib/audio";
import { blendOver } from "@/lib/color";
import { formatDateRange } from "@/lib/dates";
import type { Project } from "@/types/projects";

export function ProjectCard({ project }: { project: Project }) {
  const [active, setActive] = useState(false);
  const { palette } = usePalette();
  const playHover = useSound("hover");
  const hoverBackground = blendOver(palette.background, palette.foreground, 0.1);

  return (
    <Link
      href={`/projects/${project.slug}`}
      onPointerEnter={(e) => {
        setActive(true);
        if (e.pointerType === "mouse") playHover();
      }}
      onPointerLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      data-project-card
      className="group/card relative block w-full rounded-lg pt-3 transition-colors last:border-b-0 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/40"
    >
      <div className="mx-auto flex max-w-136 items-center gap-3 border-b border-foreground/10 pb-3 transition-colors group-hover/card:border-transparent group-last/card:border-b-0">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-foreground/12 p-0.5">
          <Image src={project.logo ?? "/logo-placeholder.svg"} width={24} height={24} alt="" aria-hidden className="relative z-10 block h-6 w-6 rounded-[3px] object-contain" />
          <div className="absolute inset-1 overflow-hidden rounded-[2px] opacity-5 transition-opacity duration-300 group-hover/card:opacity-80">
            <Wave
              color={project.color}
              variant="logo"
              animate={active}
              background={active ? hoverBackground : undefined}
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="flex w-full min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="min-w-0 truncate text-[13px] font-medium leading-tight text-text-highlight">
              {project.title}
            </h3>
            <p className="mt-1 truncate text-[12px] text-foreground/55">
              {project.subtitle}
            </p>
          </div>

          <div className="hidden shrink-0 flex-col items-end sm:flex">
            <span className="text-[11px] text-foreground/30 transition-colors group-hover/card:text-foreground/50">
              {formatDateRange(project.startDate, project.endDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

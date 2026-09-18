"use client";
import Image from "next/image";
import { ArrowUpRight, ChevronDown, ExternalLink, FileText } from "lucide-react";
import Wave from "@/components/ui/wave";
import TechBadge from "@/components/ui/tech-badge";
import { usePalette } from "@/components/providers/palette-provider";
import { blendOver } from "@/lib/color";
import { formatDateRange } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";
import { useToggleSound } from "./use-toggle-sound";

const LINKS = [
  { key: "live", label: "Live", icon: ExternalLink },
  { key: "github", label: "Source", icon: ArrowUpRight },
  { key: "writeup", label: "Write-up", icon: FileText },
] as const;

export function ProjectCard({ project, last = false }: { project: Project; last?: boolean }) {
  const [open, toggle] = useToggleSound();
  const { palette } = usePalette();
  const hoverBackground = blendOver(palette.background, palette.foreground, 0.1);
  const panelId = `project-${project.slug}`;

  const links = LINKS.filter((link) => project[link.key]);

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        data-project-card
        className="group/card relative block w-full cursor-pointer rounded-lg pt-3 text-left transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/40"
      >
        <div
          className={cn(
            "mx-auto flex max-w-136 items-center gap-3 border-b pb-3 transition-colors group-hover/card:border-transparent",
            open || last ? "border-transparent" : "border-foreground/10",
          )}
        >
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-foreground/12 p-0.5">
            <Image src={project.logo ?? "/logo-placeholder.svg"} width={24} height={24} alt="" aria-hidden className="relative z-10 block h-6 w-6 rounded-[3px] object-contain" />
            <div className="absolute inset-1 overflow-hidden rounded-[2px] opacity-5 transition-opacity duration-300 group-hover/card:opacity-80">
              <Wave
                color={project.color}
                variant="logo"
                animate={open}
                background={open ? hoverBackground : undefined}
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

            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-[11px] text-foreground/30 transition-colors group-hover/card:text-foreground/50 sm:block">
                {formatDateRange(project.startDate, project.endDate)}
              </span>
              <ChevronDown
                aria-hidden
                className={cn(
                  "h-3.5 w-3.5 text-foreground/30 transition-transform duration-300",
                  open && "rotate-180",
                )}
              />
            </div>
          </div>
        </div>
      </button>

      <div
        id={panelId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-[360ms] ease-out motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "mx-auto max-w-136 space-y-2.5 pt-3 pb-4 pl-15 text-[12px] leading-relaxed text-foreground/70",
              "transition-opacity duration-200 ease-out motion-reduce:transition-none",
              open ? "opacity-100 delay-100" : "opacity-0",
            )}
          >
            <p>{project.what || project.description}</p>
            {project.why && <p className="text-foreground/50">{project.why}</p>}
            {project.result && <p className="text-foreground/50">{project.result}</p>}

            {project.tech && project.tech.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {project.tech.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            )}

            {links.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                {links.map(({ key, label, icon: Icon }) => (
                  <a
                    key={key}
                    href={project[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[11px] text-foreground/45 transition-colors hover:text-text-highlight focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/40"
                  >
                    <Icon className="h-3 w-3" aria-hidden />
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

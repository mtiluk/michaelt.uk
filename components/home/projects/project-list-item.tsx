"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getYear } from "@/lib/dates";
import TechBadge from "@/components/ui/tech-badge";
import type { Project } from "@/types/projects";
import { StarBadge } from "./star-badge";
import { useToggleSound } from "./use-toggle-sound";

export function ProjectListItem({ project }: { project: Project }) {
  const [open, toggle] = useToggleSound();
  const panelId = `project-panel-${project.slug}`;

  return (
    <div className="cursor-pointer last:border-b-0">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="group w-full rounded-lg py-2 text-left transition-colors hover:bg-foreground/10"
      >
        <div className="mx-auto flex max-w-136 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[12px] leading-none text-foreground/30 transition-colors group-hover:text-foreground/50">
              {getYear(project.startDate)}
            </span>
            <h3 className="min-w-0 truncate text-[13px] font-medium leading-none text-text-highlight">
              {project.title}
            </h3>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <p className="hidden max-w-40 truncate text-[12px] text-foreground/55 sm:block">
              {project.subtitle}
            </p>
            <ChevronDown
              aria-hidden
              className={cn(
                "h-3.5 w-3.5 text-foreground/30 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mx-auto max-w-136 space-y-1 pb-3 text-[11px] leading-snug text-foreground/70">
              {project.what && (
                <p>
                  <span className="text-foreground/40 underline">What:</span>{" "}
                  {project.what}
                </p>
              )}
              {project.why && (
                <p>
                  <span className="text-foreground/40 underline">Why:</span>{" "}
                  {project.why}
                </p>
              )}
              {project.result && (
                <p>
                  <span className="text-foreground/40 underline">Result:</span>{" "}
                  {project.result}
                </p>
              )}

              {(project.tech?.length || project.stars !== undefined) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {project.tech?.map((tech) => <TechBadge key={tech} name={tech} />)}
                  {project.stars !== undefined && <StarBadge count={project.stars} />}
                </div>
              )}

              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-0.5 pt-1 text-[11px] text-foreground/45 transition-colors hover:text-text-highlight focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/40"
              >
                Read more
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

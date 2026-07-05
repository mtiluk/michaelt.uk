"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import Wave from "@/components/ui/wave";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group/card block w-full rounded-lg pt-3 transition-colors last:border-b-0 hover:bg-foreground/10">
      <div className="mx-auto flex max-w-136 items-center gap-2 border-b border-foreground/10 pb-3 transition-colors group-hover/card:border-transparent group-last/card:border-b-0">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-foreground/12 p-0.5">
          <Image src={project.logo ?? "/logo-placeholder.svg"} width={24} height={24} alt="" aria-hidden className="relative z-10 block h-6 w-6 rounded-[3px] object-contain" />
          <div className="absolute inset-0 opacity-5 transition-opacity duration-300 group-hover/card:opacity-100">
            <Wave
              color={project.color ?? "#5E6C32"}
              variant="logo"
              className="h-full w-full"
            />
          </div>
        </div>

        <div className="flex w-full min-w-0 items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="min-w-0 truncate text-[14px] font-medium leading-tight text-text-highlight">
                {project.title}
              </h3>
            </div>
            <p className="mt-0.5 truncate text-[13px] text-foreground/55">
              {project.subtitle}
            </p>
          </div>

          <span className="hidden shrink-0 text-[12px] text-foreground/30 transition-colors group-hover/card:text-foreground/50 sm:block">
            {project.startDate} – {project.endDate}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProjectListItem({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const panelId = `project-panel-${project.slug}`;

  const playExpand = useSound(retro.expand);
  const playCollapse = useSound(retro.collapse);

  function toggle() {
    if (open) playCollapse();
    else playExpand();
    setOpen((v) => !v);
  }

  return (
    <div className="cursor-pointer last:border-b-0">
      <button type="button" onClick={toggle} aria-expanded={open} aria-controls={panelId} className="group w-full rounded-lg py-2 text-left transition-colors hover:bg-foreground/10"      >
        <div className="mx-auto flex max-w-136 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 text-[12px] leading-none text-foreground/30 transition-colors group-hover:text-foreground/50">
              {project.year}
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Projects({ isList = false, projects }: { isList?: boolean; projects: Project[]; }) {
  const [showAll, setShowAll] = useState(false);

  const playExpand = useSound(retro.expand);
  const playCollapse = useSound(retro.collapse);

  const handleToggle = () => {
    if (showAll) playCollapse();
    else playExpand();
    setShowAll((prev) => !prev);
  };

  const Component = isList ? ProjectListItem : ProjectCard;

  if (projects.length === 0) {
    return (
      <div className="mx-auto w-full max-w-136 text-center">
        <div className="w-full border-t border-dashed border-foreground/20" />
        <pre
          aria-hidden
          className="my-2 text-[10px] leading-3 text-foreground/20"
        >
{` .-.
(o o)
| O \\
|   \\
'~~~'`}
        </pre>
        <p className="mb-2 text-[10px] text-foreground/40">No projects yet</p>
        <div className="w-full border-b border-dashed border-foreground/20" />
      </div>
    );
  }

  const visibleProjects = !isList && !showAll ? projects.slice(0, 3) : projects;

  return (
    <div>
      <div>
        {visibleProjects.map((project) => (
          <Component key={project.slug} project={project} />
        ))}
      </div>
      {!isList && projects.length > 3 && (
        <button type="button" onClick={handleToggle} aria-expanded={showAll} className="mt-2 w-full text-center text-[11px] text-foreground/40 transition-colors hover:text-foreground/70" >
          {showAll ? "Show less" : "View all"}
        </button>
      )}
    </div>
  );
}

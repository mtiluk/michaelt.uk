"use client";

import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";
import { HoverHighlight, useHoverHighlight } from "@/components/ui/hover-highlight";
import EmptyState from "@/components/ui/empty-state";
import { ProjectCard } from "./project-card";
import { useToggleSound } from "./use-toggle-sound";

export default function Projects({ projects, limit = 4 }: { projects: Project[]; limit?: number }) {
  const [showAll, toggleShowAll] = useToggleSound();
  const highlight = useHoverHighlight("data-project-card");

  if (projects.length === 0) return <EmptyState message="No projects yet" />;

  const shown = projects.slice(0, limit);
  const rest = projects.slice(limit);
  const lastVisible = (showAll && rest.length > 0 ? rest : shown).at(-1)?.slug;

  return (
    <div>
      <HoverHighlight highlight={highlight}>
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} last={project.slug === lastVisible} />
        ))}

        <div
          inert={!showAll}
          className={cn(
            "grid transition-[grid-template-rows] duration-[360ms] ease-out motion-reduce:transition-none",
            showAll ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden">
            {rest.map((project) => (
              <ProjectCard key={project.slug} project={project} last={project.slug === lastVisible} />
            ))}
          </div>
        </div>
      </HoverHighlight>
      {projects.length > limit && (
        <button
          type="button"
          onClick={toggleShowAll}
          aria-expanded={showAll}
          className="mt-5 w-full text-center text-[11px] text-foreground/40 transition-colors hover:text-foreground/70"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      )}
    </div>
  );
}

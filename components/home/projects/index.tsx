"use client";

import type { Project } from "@/types/projects";
import { ProjectCard } from "./project-card";
import { ProjectListItem } from "./project-list-item";
import { useToggleSound } from "./use-toggle-sound";

export default function Projects({ isList = false, projects }: { isList?: boolean; projects: Project[]; }) {
  const [showAll, toggleShowAll] = useToggleSound();

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
      {visibleProjects.map((project) => (
        <Component key={project.slug} project={project} />
      ))}
      {!isList && projects.length > 3 && (
        <button
          type="button"
          onClick={toggleShowAll}
          aria-expanded={showAll}
          className="mt-2 w-full text-center text-[11px] text-foreground/40 transition-colors hover:text-foreground/70"
        >
          {showAll ? "Show less" : "View all"}
        </button>
      )}
    </div>
  );
}

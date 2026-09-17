"use client";

import { useRef, useState } from "react";
import type { Project } from "@/types/projects";
import { ProjectCard } from "./project-card";
import { ProjectListItem } from "./project-list-item";
import { useToggleSound } from "./use-toggle-sound";

export default function Projects({ isList = false, projects }: { isList?: boolean; projects: Project[]; }) {
  const [showAll, toggleShowAll] = useToggleSound();
  const listRef = useRef<HTMLDivElement>(null);
  const [highlight, setHighlight] = useState({ top: 0, height: 0, visible: false, moving: false });

  function moveHighlight(target: EventTarget) {
    const card = (target as HTMLElement).closest<HTMLElement>("[data-project-card]");
    if (!card || !listRef.current?.contains(card)) return;
    setHighlight((prev) => ({
      top: card.offsetTop,
      height: card.offsetHeight,
      visible: true,
      moving: prev.visible,
    }));
  }

  function hideHighlight() {
    setHighlight((prev) => ({ ...prev, visible: false, moving: false }));
  }

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

  const limit = isList ? 5 : 3;
  const visibleProjects = !showAll ? projects.slice(0, limit) : projects;

  return (
    <div>
      <div
        ref={listRef}
        className="relative"
        onPointerOver={isList ? undefined : (e) => moveHighlight(e.target)}
        onPointerLeave={isList ? undefined : hideHighlight}
        onFocus={isList ? undefined : (e) => moveHighlight(e.target)}
        onBlur={
          isList
            ? undefined
            : (e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) hideHighlight();
              }
        }
      >
        {!isList && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 rounded-lg bg-foreground/10 ease-out motion-reduce:transition-none"
            style={{
              top: highlight.top,
              height: highlight.height,
              opacity: highlight.visible ? 1 : 0,
              transitionProperty: highlight.moving ? "top, height, opacity" : "opacity",
              transitionDuration: "200ms",
            }}
          />
        )}
        {visibleProjects.map((project) => (
          <Component key={project.slug} project={project} />
        ))}
      </div>
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

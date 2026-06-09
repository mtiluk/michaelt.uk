"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Status from "./status";
import LogoWave from "../logo-wave";
import { Project } from "@/types/projects";
import { usePlaySound } from "../ui/sensory-ui/config/use-play-sound";

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group/card last:border-b-0 hover:bg-foreground/10 rounded-lg pt-3 block w-full transition-all" >
      <div className="max-w-[544px] mx-auto border-b border-foreground/10 group-hover/card:border-transparent group-last/card:border-b-0 pb-3 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded flex-shrink-0 flex items-center justify-center overflow-hidden relative border border-foreground/[0.12] p-0.5">
            <Image
              src="/logo-livedocs.svg"
              width="24"
              height="24"
              alt="Live docs"
              className="w-6 h-6 object-contain rounded-[3px] block relative z-10"
            />

            <div className="absolute inset-0 opacity-5 group-hover/card:opacity-100 transition-opacity duration-300">
              <LogoWave color="#5E6C32" />
            </div>
          </div>

          <div className="flex justify-between w-full">
            <div>
              <div className="flex gap-2 items-center">
                <h3 className="text-[14px] font-medium text-text-highlight leading-tight flex flex-wrap items-center gap-1.5">
                  {project.title}
                </h3>
                <Status status={project.status} />
              </div>
              <p className="mt-0.5 text-[13px] text-foreground/55 truncate">
                {project.subtitle}
              </p>
            </div>

            <span className="text-[12px] text-foreground/30 group-hover/card:text-foreground/50 transition-colors flex-shrink-0">
              {project.startDate} – {project.endDate}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ProjectListItem({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group last:border-b-0 hover:bg-foreground/10 rounded-lg pt-3 block w-full transition-all"
    >
      <div className="max-w-[544px] mx-auto border-b border-foreground/10 group-hover:border-transparent group-last:border-b-0 pb-3 transition-colors">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-foreground/30 leading-none group-hover:text-foreground/50 transition-colors flex-shrink-0">
              {project.year}
            </span>
            <div className="flex gap-2 items-center">
              <h3 className="text-[13px] font-medium text-text-highlight leading-none flex flex-wrap items-center">
                {project.title}
              </h3>
              <Status status={project.status} />
            </div>
          </div>
          <p className="mt-0.5 text-[12px] text-foreground/55 truncate">
            {project.subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Projects({ isList = false, projects }: { isList?: boolean; projects: Project[] }) {
  const [showAll, setShowAll] = useState(false);

  const { play: playExpand } = usePlaySound({
    sound: "overlay.expand",
  });

  const { play: playCollapse } = usePlaySound({
    sound: "overlay.collapse",
  });

  const handleToggle = () => {
    if (showAll) {
      playCollapse();
    } else {
      playExpand();
    }

    setShowAll((prev) => !prev);
  };

  const Component = isList ? ProjectListItem : ProjectCard;

  if (projects.length === 0) {
    return (
      <div className="max-w-[544px] mx-auto text-text-highlight/20">
        <p>No projects found.</p>
      </div>
    );
  }

  const visibleProjects =
    !isList && !showAll ? projects.slice(0, 3) : projects;

  return (
    <div>
      <div>
        {visibleProjects.map((project) => (
          <Component key={project.title} project={project} />
        ))}
      </div>
      {!isList && projects.length > 3 && (
        <button onClick={handleToggle} className="mt-2 text-[11px] w-full text-center mt-2 text-foreground/40 hover:text-foreground/70 transition-colors" >
          {showAll ? "Show less" : "View all"}
        </button>
      )}
    </div>
  );
}

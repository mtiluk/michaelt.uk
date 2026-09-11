import Image from "next/image";
import Link from "next/link";
import Wave from "@/components/ui/wave";
import { formatDateRange } from "@/lib/dates";
import type { Project } from "@/types/projects";
import { StarBadge } from "./star-badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group/card block w-full rounded-lg pt-3 transition-colors last:border-b-0 hover:bg-foreground/10 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-text-highlight/40"
    >
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

        <div className="flex w-full min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="min-w-0 truncate text-[14px] font-medium leading-tight text-text-highlight">
              {project.title}
            </h3>
            <p className="mt-0.5 truncate text-[13px] text-foreground/55">
              {project.subtitle}
            </p>
          </div>

          <div className="hidden shrink-0 flex-col items-end sm:flex">
            {project.stars !== undefined && (
              <StarBadge count={project.stars} className="text-[12px]" />
            )}
            <span className="mt-0.5 text-[12px] text-foreground/30 transition-colors group-hover/card:text-foreground/50">
              {formatDateRange(project.startDate, project.endDate)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

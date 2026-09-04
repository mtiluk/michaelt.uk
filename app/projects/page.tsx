import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Star } from "lucide-react";
import getAllContent from "@/lib/content";
import { byDateDesc, formatDateRange } from "@/lib/dates";
import { withStars } from "@/lib/github";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/types/projects";

const projectDirectory = path.join(process.cwd(), "content/projects");

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project Michael Tilley has built, from research prototypes to shipped products.",
};

export default async function ProjectsPage() {
  const projects = await withStars(
    getAllContent<Project>(projectDirectory, {
      sort: byDateDesc((project) => project.endDate),
    }),
  );

  return (
    <main className="container relative z-20 mx-auto max-w-xl px-5 pt-[14vh] pb-24 md:px-0">
      <div className="mx-auto max-w-136">
        <Reveal variant="fade-down">
          <Link
            href="/"
            className="group flex items-center gap-1.5 text-[12px] text-foreground/70 transition-colors hover:text-text-highlight"
          >
            <ArrowLeft
              className="h-3 w-3 transition-transform duration-300 group-hover:-translate-x-0.5"
              aria-hidden
            />
            Home
          </Link>
        </Reveal>

        <Reveal variant="blur-up" delay={0.05}>
          <h1 className="mt-6 font-serif text-[28px] text-balance text-text-highlight">
            Projects
          </h1>
          <p className="mt-2 text-[13px] text-foreground/55">
            Everything I&apos;ve built, from research prototypes to shipped products.
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <ul className="mt-6 divide-y divide-foreground/10 border-t border-foreground/10">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex items-center justify-between gap-4 py-3 transition-colors hover:text-text-highlight"
                >
                  <div className="min-w-0">
                    <h2 className="truncate text-[14px] font-medium text-text-highlight">
                      {project.title}
                    </h2>
                    <p className="mt-0.5 truncate text-[12px] text-foreground/55">
                      {project.subtitle}
                    </p>
                    {project.languages && project.languages.length > 0 && (
                      <p className="mt-1 truncate text-[10px] text-foreground/35">
                        {project.languages.join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {project.stars !== undefined && (
                      <span className="hidden items-center gap-1 text-[11px] text-[#e3b341] sm:flex">
                        <Star className="h-3 w-3" fill="currentColor" aria-hidden />
                        {project.stars.toLocaleString()}
                      </span>
                    )}
                    <span className="hidden text-[11px] text-foreground/40 sm:block">
                      {formatDateRange(project.startDate, project.endDate)}
                    </span>
                    <ArrowUpRight
                      className="h-3 w-3 text-foreground/30 transition-colors group-hover:text-text-highlight"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </main>
  );
}

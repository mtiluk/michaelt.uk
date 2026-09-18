import type { Metadata } from "next";
import { withStars } from "@/lib/github";
import { getProjects } from "@/lib/projects";
import { rssAlternate } from "@/lib/site";
import PageShell, { BackLink } from "@/components/layout/page-shell";
import Projects from "@/components/home/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every project Michael Tilley has built, from research prototypes to shipped products.",
  alternates: { canonical: "/projects", types: rssAlternate },
};

export default async function ProjectsPage() {
  const projects = await withStars(getProjects());

  return (
    <PageShell>
          <BackLink />

          <h1 className="mt-6 font-serif text-[28px] text-balance text-text-highlight">
            Projects
          </h1>
          <p className="mt-2 text-[13px] text-foreground/55">
            Everything I&apos;ve built, from research prototypes to shipped products.
          </p>

          <div className="mt-6 border-t border-foreground/10">
            <Projects projects={projects} limit={projects.length} />
          </div>
    </PageShell>
  );
}

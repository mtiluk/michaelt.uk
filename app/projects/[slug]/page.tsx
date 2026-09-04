import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { ArrowLeft, ExternalLink, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import getAllContent, { getContentBySlug } from "@/lib/content";
import { formatDateRange } from "@/lib/dates";
import { getRepoStars } from "@/lib/github";
import { BsGithub } from "@/components/icons/brand";
import { mdxComponents } from "@/components/article/mdx-components";
import References from "@/components/article/references";
import ShareMenu from "@/components/article/share-menu";
import Badge from "@/components/ui/badge";
import TechBadge from "@/components/ui/tech-badge";
import Wave from "@/components/ui/wave";
import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/types/projects";
import Gallery from "@/components/article/gallery";

const projectDirectory = path.join(process.cwd(), "content/projects");

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getAllContent<Project>(projectDirectory).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getContentBySlug<Project>(projectDirectory, slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
      url: `/projects/${slug}`,
    },
  };
}

const linkClass =
  "inline-flex items-center gap-1 text-[11px] text-foreground/75 transition-all hover:text-text-highlight/75";

function SummaryRow({ label, body }: { label: string; body: string }) {
  return (
    <div className="grid gap-1 px-3 py-2.5 sm:grid-cols-[70px_1fr] sm:gap-3">
      <dt className="text-[11px] leading-5 text-foreground/35">{label}</dt>
      <dd className="text-[12px] leading-5 text-foreground/70">{body}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getContentBySlug<Project>(projectDirectory, slug);
  if (!project) notFound();

  const body = project.content.trim();
  const showDescription =
    project.description && project.description.trim() !== project.what?.trim();
  const hasSummary = project.what || project.why || project.result;
  const dates = formatDateRange(project.startDate, project.endDate);
  const stars = project.github ? await getRepoStars(project.github) : null;

  return (
    <main className="container relative z-20 mx-auto max-w-xl px-5 pt-[14vh] pb-24 md:px-0">
      <div className="mx-auto max-w-136">
        <Reveal variant="fade-down">
          <div className="mb-8 flex items-center justify-between">
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
            <ShareMenu title={project.title} />
          </div>
        </Reveal>

        <Reveal variant="blur-up" delay={0.05}>
          <header className="flex items-center gap-3">
            <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded border border-foreground/12 p-0.5">
              <Image
                src={project.logo ?? "/logo-placeholder.svg"}
                width={24}
                height={24}
                alt=""
                aria-hidden
                className="relative z-10 block size-6 rounded-[3px] object-contain"
              />
              <div className="absolute inset-0 opacity-40">
                <Wave
                  color={project.color ?? "#5E6C32"}
                  variant="logo"
                  className="h-full w-full"
                />
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="font-serif text-[28px] leading-tight text-balance text-text-highlight">
                {project.title}
              </h1>
              <p className="mt-0.5 text-[13px] text-foreground/55">{project.subtitle}</p>
            </div>
          </header>
        </Reveal>

        <Reveal variant="fade" delay={0.1}>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge title={dates} />
            {project.status && <Badge title={project.status} />}
            {project.tech?.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={0.14}>
          {showDescription && (
            <p className="mt-3 text-[13px] leading-snug text-pretty text-text-highlight">
              {project.description}
            </p>
          )}

          {(project.github || project.writeup) && (
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {project.github && (
                <div className="flex items-center gap-2">
                  <Link href={project.github} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <BsGithub className="h-3 w-3" aria-hidden />
                    Source
                  </Link>
                  {stars !== null && (
                    <span className="flex items-center gap-1 text-[11px] text-[#e3b341]">
                      <Star className="h-3 w-3" fill="currentColor" aria-hidden />
                      {stars.toLocaleString()}
                    </span>
                  )}
                </div>
              )}
              {project.writeup && (
                <Link href={project.writeup} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <ExternalLink className="h-3 w-3" aria-hidden />
                  Write-up
                </Link>
              )}
            </div>
          )}
        </Reveal>

        {hasSummary && (
          <Reveal variant="fade-up" delay={0.18}>
            <dl className="mt-3 divide-y divide-foreground/10 rounded-xl bg-text-highlight/2 transition-colors duration-300">
              {project.what && <SummaryRow label="What" body={project.what} />}
              {project.why && <SummaryRow label="Why" body={project.why} />}
              {project.result && <SummaryRow label="Result" body={project.result} />}
            </dl>
          </Reveal>
        )}

        {project.images && project.images.length > 0 && (
          <Reveal variant="fade-up" delay={0.2}>
            <Gallery images={project.images} />
          </Reveal>
        )}

        {body ? (
          <>
            <div className="my-10 border-t border-foreground/10" />

            <Reveal variant="fade-up" delay={0.22}>
              <article>
                <MDXRemote
                  source={body}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      rehypePlugins: [
                        rehypeSlug,
                        [rehypePrettyCode, { theme: "vesper", keepBackground: false }],
                      ],
                    },
                  }}
                />
              </article>
            </Reveal>

            <Reveal inView>
              <References content={body} />
            </Reveal>
          </>
        ) : (
          <Reveal variant="fade" delay={0.22}>
            <p className="mt-10 text-[12px] text-foreground/35">
              A full write-up for this project is on the way.
            </p>
          </Reveal>
        )}
      </div>
    </main>
  );
}

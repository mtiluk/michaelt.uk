import path from "node:path";
import type { Metadata } from "next";
import getAllContent from "@/lib/content";
import { byDateDesc } from "@/lib/dates";
import { withStars } from "@/lib/github";
import { rssAlternate } from "@/lib/site";
import type { Blog } from "@/types/blogs";
import type { Project } from "@/types/projects";
import Contact from "@/components/home/contact";
import AnimatedBadge from "@/components/ui/animated-badge";
import Navigation from "@/components/home/navigation";
import { Reveal } from "@/components/ui/reveal";
import Tooltip from "@/components/ui/tooltip";
import Age from "@/components/ui/age";
import { Boxes } from "lucide-react";
import { SiGo, SiTypescript } from "@/components/icons/tech";

const blogDirectory = path.join(process.cwd(), "content/blogs");
const projectDirectory = path.join(process.cwd(), "content/projects");

const hint = "cursor-pointer text-text-highlight";
const tip = "flex items-center gap-1.5 text-text-highlight hover:underline underline-offset-2";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: rssAlternate },
};

export default async function Home() {
  const projects = await withStars(
    getAllContent<Project>(projectDirectory, {
      sort: byDateDesc((project) => project.endDate),
    }),
  );

  const blogs = getAllContent<Blog>(blogDirectory, {
    sort: byDateDesc((blog) => blog.publishedAt),
  });

  return (
    <main className="container relative z-20 mx-auto max-w-xl md:pt-[20vh] pt-[14vh] px-5 md:px-0">
      <div className="mx-auto max-w-136">
        <Reveal variant="blur-up">
          <header className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h1 className="font-serif text-[30px] leading-none tracking-[-0.01em] text-balance text-text-highlight">
              Michael Tilley
            </h1>

            <p aria-hidden className="text-[11px] tracking-wide text-text-highlight/45">
              /ˈmaɪ·kəl ˈtɪl·i/
            </p>
          </header>
        </Reveal>

        <Reveal variant="fade" delay={0.08} className="mt-2.5">
          <AnimatedBadge />
        </Reveal>

        <Reveal variant="fade-up" delay={0.12}>
          <div className="mt-4 space-y-2.5 text-[13px] leading-relaxed text-pretty">
            <p>
              I&apos;m{" "}
              <Tooltip content="🌸">
                <span className={hint}>Michael</span>
              </Tooltip>
              , a{" "}
              <Tooltip content={<Age birth="2004-06-12" />}>
                <span className={hint}>22</span>
              </Tooltip>{" "}
              year old in the{" "}
              <Tooltip
                content={
                  <span className={tip}>
                    🗺️
                    maps.google.com
                  </span>
                }
              >
                <a
                  href="https://maps.apple.com/search?query=United%20Kingdom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={hint}
                >
                  United Kingdom <span aria-hidden>🇬🇧</span>
                </a>
              </Tooltip>{" "}
              passionate about privacy redesigns of common systems, secure cloud and networks
              engineering, and embedded and IoT systems, using{" "}
              <Tooltip
                content={
                  <span className={tip}>
                    <SiTypescript className="size-3 shrink-0" style={{ color: "#3178C6" }} aria-hidden />
                    typescriptlang.org
                  </span>
                }
              >
                <a href="https://www.typescriptlang.org" target="_blank" rel="noopener noreferrer" className={hint}>
                  TypeScript
                </a>
              </Tooltip>
              ,{" "}
              <Tooltip
                content={
                  <span className={tip}>
                    <SiGo className="size-3 shrink-0" style={{ color: "#00ADD8" }} aria-hidden />
                    go.dev
                  </span>
                }
              >
                <a href="https://go.dev" target="_blank" rel="noopener noreferrer" className={hint}>
                  Go
                </a>
              </Tooltip>{" "}
              and{" "}
              <Tooltip
                content={
                  <span className={tip}>
                    <Boxes className="size-3 shrink-0" aria-hidden />
                    rust-lang.org
                  </span>
                }
              >
                <a href="https://www.rust-lang.org" target="_blank" rel="noopener noreferrer" className={hint}>
                  Rust
                </a>
              </Tooltip>
              .
            </p>

            <p>
              Currently focused on building projects and researching, attempting to increase my knowledge and understanding of distributed systems and networking.
            </p>

            <p>Looking for my next thing. Come say hi.</p>
          </div>
        </Reveal>

        <Reveal variant="fade-up" delay={0.18}>
          <Contact />
        </Reveal>
      </div>

      <Reveal variant="fade" delay={0.25}>
        <Navigation projects={projects} blogs={blogs} />
      </Reveal>
    </main>
  );
}

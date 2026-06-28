import path from "node:path";
import getAllContent from "@/lib/content";
import type { Blog } from "@/types/blogs";
import type { Project } from "@/types/projects";
import Contact from "@/components/home/contact";
import AnimatedBadge from "@/components/home/animated-badge";
import Navigation from "@/components/home/navigation";

const blogDirectory = path.join(process.cwd(), "content/blogs");
const projectDirectory = path.join(process.cwd(), "content/projects");

export default async function Home() {
  const [blogs, projects] = await Promise.all([
    getAllContent<Blog>(blogDirectory),
    getAllContent<Project>(projectDirectory),
  ]);

  return (
    <main className="container relative z-20 mx-auto max-w-xl md:pt-[20vh] pt-[14vh] px-5 md:px-0">
      <div className="mx-auto max-w-136">
        <header className="flex items-baseline gap-2.5">
          <h1 className="font-serif text-[28px] text-balance text-text-highlight">
            Michael Tilley
          </h1>
          <p aria-hidden className="text-[11px] tracking-wider text-text-highlight/45" >
            /ˈmaɪ·kəl ˈtɪl·i/
          </p>
        </header>

        <AnimatedBadge />

        <div className="mt-3 space-y-3 text-[13px] leading-snug text-pretty">
          <p className="text-text-highlight">
            A Computer Science graduate and research assistant whose current
            research interests centre on privacy redesigns of common systems,
            secure cloud and networks engineering, and embedded and IOT
          </p>
          <p>
            Currently focused on building projects and researching, attempting
            to increase my knowledge and understanding of distributed systems
            and networking.
          </p>
          <p>Looking for my next thing. Come say hi.</p>
        </div>

        <Contact />
      </div>

      <Navigation projects={projects} blogs={blogs} />
    </main>
  );
}

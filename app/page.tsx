import Contact from "@/components/home/contact";
import AnimatedBadge from "@/components/home/animated-badge";
import Navigation from "@/components/home/navigation";
import type { Blog } from "@/types/blogs";
import type { Project } from "@/types/projects";
import getAllContent from "@/lib/content";
import path from "node:path";


const blogDirectory = path.join(process.cwd(), "content/blogs");
const projectDirectory = path.join(process.cwd(), "content/projects");

export default async function Home() {
  const blogs = getAllContent<Blog>(blogDirectory);
  const projects = getAllContent<Project>(projectDirectory);

  return (
    <div className="container max-w-xl mx-auto relative z-20 pt-[20vh]">
      <div className="max-w-[544px] mx-auto">
        <div className="flex items-baseline gap-2.5">
          <h1 className="text-[28px] text-text-highlight text-balance font-serif">
            Michael Tilley
          </h1>
          <p className="text-[11px] text-text-highlight/45 tracking-[0.05em]">
            /ˈmaɪ·kəl ˈtɪl·i/
          </p>
        </div>

        <div>
          <AnimatedBadge />
        </div>

        <div className="mt-3 text-[13px] leading-snug space-y-3 text-pretty">
          <p className="text-text-highlight">
            A Computer Science graduate and research assistant whose current
            research interests centre on privacy redesigns of common systems,
            secure cloud and networks engineering, and embedded and IOT Systems.
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
    </div>
  );
}

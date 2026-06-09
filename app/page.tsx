import Contact from "@/components/home/contact";
import AnimatedBadge from "@/components/home/animated-badge";
import Navigation from "@/components/home/navigation";
import { getAllProjects } from "@/lib/projects";

export default async function Home() {
  const projects = getAllProjects();

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
            I design and build world class interfaces with obsessive attention.
            A generalist by nature, I learn by breaking things, making things,
            and connecting dots across disciplines.
          </p>

          <p>
            Currently focused on the intersection of creation and distribution.
            The tools, platforms, and infrastructure that power what people
            make, watch, and share.
          </p>

          <p>Looking for my next thing. Come say hi.</p>
        </div>

        <Contact />
      </div>


      <Navigation projects={projects} />
    </div>
  );
}

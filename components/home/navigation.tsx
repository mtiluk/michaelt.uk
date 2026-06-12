"use client";
import Projects from "@/components/home/projects";
import Blogs from "@/components/home/blogs";
import { Menu, Columns3 } from "lucide-react";
import { useState, useEffect } from "react";
import { Project } from "@/types/projects";
import { usePlaySound } from "../ui/sensory-ui/config/use-play-sound";

export default function Navigation({ projects }: { projects: Project[] }) {
  const [isList, setIsList] = useState(true);
  const [activeSection, setActiveSection] = useState("work");

  const { play } = usePlaySound({ sound: "interaction.subtle" });

  return (
    <div className="mt-10">
      <div className="max-w-[544px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-5">

          <button onClick={() => { setActiveSection("work"); play() }} className={`text-[15px] cursor-pointer transition-all font-medium ${activeSection === "work" ? "text-text-highlight/80" : "text-text-highlight/20"}`} >Work</button>
          <button onClick={() => { setActiveSection("blogs"); play() }} className={`text-[15px] cursor-pointer transition-all font-medium ${activeSection === "blogs" ? "text-text-highlight/80" : "text-text-highlight/20"}`} >Blogs</button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => { setIsList(false); play() }}
            className={`${isList ? "" : "bg-text-highlight/10"} relative hover:bg-text-highlight/10 flex items-center p-1.5 text-[10px] rounded-[6px] text-foreground hover:text-text-highlight transition-colors duration-200`}
          >
            <Menu className="w-3 h-3" />
          </button>

          <button
            onClick={() => { setIsList(true); play() }}
            className={`${isList ? "bg-text-highlight/10" : ""} relative hover:bg-text-highlight/10 flex items-center p-1.5 text-[10px] rounded-[6px] text-foreground hover:text-text-highlight transition-colors duration-200`}
          >
            <Columns3 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="w-full mt-4">
        <div className={activeSection === "work" ? undefined : "hidden"}>
          <Projects isList={isList} projects={projects} />
        </div>
        <div className={activeSection === "blogs" ? undefined : "hidden"}>
          <Blogs />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { Menu, Columns3 } from "lucide-react";
import Projects from "@/components/home/projects";
import Blogs from "@/components/home/blogs";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";
import type { Blog } from "@/types/blogs";
import { usePlaySound } from "../ui/sensory-ui/config/use-play-sound";

const TABS = [
  { id: "work", label: "Work" },
  { id: "blogs", label: "Blogs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Navigation({ projects, blogs }: { projects: Project[]; blogs: Blog[]; }) {
  const [isList, setIsList] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("work");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const { play } = usePlaySound({ sound: "interaction.subtle" });

  function selectTab(id: TabId) {
    setActiveTab(id);
    play();
  }

  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + TABS.length) % TABS.length;
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
    play();
  }

  function selectView(list: boolean) {
    setIsList(list);
    play();
  }

  const viewButton =
    "relative flex items-center rounded-md p-1.5 text-foreground transition-colors duration-200 hover:bg-text-highlight/10 hover:text-text-highlight";

  return (
    <div className="mt-10">
      <div className="mx-auto flex max-w-136 items-center justify-between">
        <div role="tablist" aria-label="Content sections" className="flex items-center gap-5" >

          {TABS.map((tab, i) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={(e) => onTabKeyDown(e, i)}
                className={cn(
                  "text-[15px] font-medium transition-all",
                  selected
                    ? "text-text-highlight/80"
                    : "text-text-highlight/20",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-1" role="group" aria-label="View layout">
          <button type="button" onClick={() => selectView(true)} aria-label="List view" aria-pressed={isList} className={cn(viewButton, isList && "bg-text-highlight/10")} >
            <Menu className="h-3 w-3" aria-hidden />
          </button>
          <button type="button" onClick={() => selectView(false)} aria-label="Card view" aria-pressed={!isList} className={cn(viewButton, !isList && "bg-text-highlight/10")} >
            <Columns3 className="h-3 w-3" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div role="tabpanel" id="panel-work" aria-labelledby="tab-work" hidden={activeTab !== "work"} >
          <Projects isList={isList} projects={projects} />
        </div>
        <div role="tabpanel" id="panel-blogs" aria-labelledby="tab-blogs" hidden={activeTab !== "blogs"} >
          <Blogs blogs={blogs} />
        </div>
      </div>
    </div>
  );
}

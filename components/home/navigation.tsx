// components/home/navigation.tsx
"use client";
import { useRef, useState } from "react";
import { Menu, Columns3 } from "lucide-react";
import { useSound } from "@web-kits/audio/react";
import { retro } from "@/lib/audio";
import Projects from "@/components/home/projects";
import Blogs from "@/components/home/blogs";
import Reads from "@/components/home/reads";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";
import type { Blog } from "@/types/blogs";
import type { Read } from "@/lib/reads";

const TABS = [
  { id: "work", label: "Work" },
  { id: "blogs", label: "Blogs" },
  { id: "reads", label: "Reads" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Navigation({ projects, blogs, reads }: { projects: Project[]; blogs: Blog[]; reads: Read[]; }) {
  const [isList, setIsList] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("work");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const playSelect = useSound(retro.select);
  const playToggle = useSound(retro.toggleOn);

  function selectTab(id: TabId) {
    if (id === activeTab) return;
    playSelect();
    setActiveTab(id);
  }

  function onTabKeyDown(e: React.KeyboardEvent, index: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const next = (index + dir + TABS.length) % TABS.length;
    playSelect();
    setActiveTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  }

  function selectView(list: boolean) {
    if (list === isList) return;
    playToggle();
    setIsList(list);
  }

  const viewButton = "relative flex items-center rounded-md p-1.5 text-foreground transition-colors duration-200 hover:bg-text-highlight/10 hover:text-text-highlight";

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
                    : "text-text-highlight/20 hover:text-text-highlight/40",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            "flex gap-1 transition-opacity duration-200",
            activeTab !== "work" && "pointer-events-none opacity-0",
          )}
          role="group"
          aria-label="View layout"
          aria-hidden={activeTab !== "work"}
        >
          <button
            type="button"
            onClick={() => selectView(true)}
            aria-label="List view"
            aria-pressed={isList}
            tabIndex={activeTab === "work" ? 0 : -1}
            className={cn(viewButton, isList && "bg-text-highlight/10")}
          >
            <Menu className="h-3 w-3" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => selectView(false)}
            aria-label="Card view"
            aria-pressed={!isList}
            tabIndex={activeTab === "work" ? 0 : -1}
            className={cn(viewButton, !isList && "bg-text-highlight/10")}
          >
            <Columns3 className="h-3 w-3" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-4 w-full">
        <div
          role="tabpanel"
          id="panel-work"
          aria-labelledby="tab-work"
          hidden={activeTab !== "work"}
        >
          <Projects isList={isList} projects={projects} />
        </div>
        <div
          role="tabpanel"
          id="panel-blogs"
          aria-labelledby="tab-blogs"
          hidden={activeTab !== "blogs"}
        >
          <Blogs blogs={blogs} />
        </div>
        <div
          role="tabpanel"
          id="panel-reads"
          aria-labelledby="tab-reads"
          hidden={activeTab !== "reads"}
        >
          <Reads reads={reads} />
        </div>
      </div>
    </div>
  );
}

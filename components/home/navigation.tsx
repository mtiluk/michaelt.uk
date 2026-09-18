"use client";
import { useRef, useState } from "react";
import { useSound } from "@/lib/audio";
import Projects from "@/components/home/projects";
import Blogs from "@/components/home/blogs";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";
import type { Blog } from "@/types/blogs";

const TABS = [
  { id: "work", label: "Work" },
  { id: "blogs", label: "Blogs" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Navigation({ projects, blogs }: { projects: Project[]; blogs: Blog[] }) {
  const [activeTab, setActiveTab] = useState<TabId>("work");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const playSelect = useSound("select");

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

  return (
    <div className="mt-10">
      <div className="mx-auto flex max-w-136 items-center justify-between">
        <div role="tablist" aria-label="Content sections" className="flex items-center gap-5">
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

      </div>

      <div className="mt-4 w-full">
        <div role="tabpanel" id="panel-work" aria-labelledby="tab-work" hidden={activeTab !== "work"}>
          <Projects projects={projects} />
        </div>
        <div role="tabpanel" id="panel-blogs" aria-labelledby="tab-blogs" hidden={activeTab !== "blogs"}>
          <Blogs blogs={blogs} />
        </div>
      </div>
    </div>
  );
}

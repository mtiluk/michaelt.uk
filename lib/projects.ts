import fs from "node:fs";
import path from "node:path";
import { byDateDesc } from "./dates";
import type { Project } from "@/types/projects";

const projectsFile = path.join(process.cwd(), "content/projects.json");

export function getProjects(): Project[] {
  let raw: string;
  try {
    raw = fs.readFileSync(projectsFile, "utf8");
  } catch {
    return [];
  }

  const entries = (JSON.parse(raw) ?? []) as Project[];
  return entries
    .filter((entry) => entry?.slug && entry.title)
    .sort(byDateDesc((project) => project.endDate));
}

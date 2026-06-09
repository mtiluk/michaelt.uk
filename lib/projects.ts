import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project } from "@/types/projects";

const projectDirectory = path.join(process.cwd(), "content/projects");

export function getAllProjects(): Project[] {
  let fileNames: string[];

  try {
    fileNames = fs.readdirSync(projectDirectory);
  } catch (error) {
    return [];
  }

  const projects = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(projectDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      const parsed = data as Project;

      return {
        ...parsed,
        slug,
        content,
      };
    });

  return projects.sort((a, b) => a.title.localeCompare(b.title));
}

export function getProjectBySlug(slug: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find((project) => project.slug === slug);
}

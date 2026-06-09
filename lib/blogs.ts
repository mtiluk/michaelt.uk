import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project } from "@/types/projects";
import { Blog } from "@/types/blogs";

const blogDirectory = path.join(process.cwd(), "content/blogs");

export function getAllBlogs(): Blog[] {
  let fileNames: string[];

  try {
    fileNames = fs.readdirSync(blogDirectory);
  } catch (error) {
    return [];
  }

  const projects = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(blogDirectory, fileName);
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

import path from "node:path";
import getAllContent from "@/lib/content";
import { byDateDesc } from "@/lib/dates";
import { getSocials } from "@/lib/socials";
import type { Blog } from "@/types/blogs";
import type { Project } from "@/types/projects";

export type SearchGroup = "Pages" | "Blog" | "Projects" | "Social";

export type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: SearchGroup;
  external?: boolean;
};

const blogDirectory = path.join(process.cwd(), "content/blogs");
const projectDirectory = path.join(process.cwd(), "content/projects");

export function getSearchItems(): SearchItem[] {
  const blogs = getAllContent<Blog>(blogDirectory, {
    sort: byDateDesc((blog) => blog.publishedAt),
  }).map(
    (blog): SearchItem => ({
      id: `blog-${blog.slug}`,
      title: blog.title,
      subtitle: blog.description,
      href: `/blog/${blog.slug}`,
      group: "Blog",
    }),
  );

  const projects = getAllContent<Project>(projectDirectory, {
    sort: byDateDesc((project) => project.endDate),
  }).map(
    (project): SearchItem => ({
      id: `project-${project.slug}`,
      title: project.title,
      subtitle: project.subtitle,
      href: `/projects/${project.slug}`,
      group: "Projects",
    }),
  );

  const socials = getSocials().map(
    (social): SearchItem => ({
      id: `social-${social.platform}`,
      title: social.platform === "x" ? "X" : social.platform,
      subtitle: `@${social.handle}`,
      href: social.href,
      group: "Social",
      external: true,
    }),
  );

  const pages: SearchItem[] = [{ id: "page-home", title: "Home", href: "/", group: "Pages" }];

  return [...pages, ...blogs, ...projects, ...socials];
}

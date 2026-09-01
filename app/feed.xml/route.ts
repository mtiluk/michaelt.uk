import path from "node:path";
import { Feed } from "feed";
import { NextResponse } from "next/server";
import type { Blog } from "@/types/blogs";
import type { Project } from "@/types/projects";
import { siteConfig } from "@/lib/site";
import getAllContent from "@/lib/content";
import { formatPublishedAt } from "@/lib/dates";

const blogDirectory = path.join(process.cwd(), "content/blogs");
const projectDirectory = path.join(process.cwd(), "content/projects");

export async function GET() {
  const [blogs, projects] = await Promise.all([
    getAllContent<Blog>(blogDirectory),
    getAllContent<Project>(projectDirectory),
  ]);

  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.language,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    updated: new Date(),
    feedLinks: {
      rss: `${siteConfig.url}/feed.xml`,
    },
  });

  const items = [
    ...blogs.map((post) => ({
      title: post.title,
      id: `${siteConfig.url}/blog/${post.slug}`,
      link: `${siteConfig.url}/blog/${post.slug}`,
      description: post.description,
      date: new Date(formatPublishedAt(post.publishedAt)),
    })),
    ...projects.map((project) => ({
      title: project.title,
      id: `${siteConfig.url}/projects/${project.slug}`,
      link: `${siteConfig.url}/projects/${project.slug}`,
      description: project.description,
      date: new Date(project.endDate ?? project.startDate ?? Date.now()),
    })),
  ]
    .filter((item) => !Number.isNaN(item.date.getTime()))
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  for (const item of items) feed.addItem(item);

  return new NextResponse(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

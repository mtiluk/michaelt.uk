import { Feed } from "feed";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { getBlogs } from "@/lib/blogs";
import { getProjects } from "@/lib/projects";

export const revalidate = 3600;


export async function GET() {
  const blogs = getBlogs();
  const projects = getProjects();

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
      date: new Date(post.publishedAt),
    })),
    ...projects.map((project) => ({
      title: project.title,
      id: `${siteConfig.url}/projects#${project.slug}`,
      link: `${siteConfig.url}/projects`,
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

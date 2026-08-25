import path from "node:path";
import type { Blog } from "@/types/blogs";
import { Feed } from "feed";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import getAllContent from "@/lib/content";
import { Project } from "@/types/projects";

const blogDirectory = path.join(process.cwd(), "content/blogs");
const projectDirectory = path.join(process.cwd(), "content/projects");

export async function GET() {
  const [blogs, projects] = await Promise.all([
    getAllContent<Blog>(blogDirectory),
    getAllContent<Project>(projectDirectory)
  ]);

  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.language,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    feedLinks: {
      rss: `${siteConfig.url}/feed.xml`
    },
  });

  for (const post of blogs) {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}/blog/${post.slug}`,
      link: `${siteConfig.url}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.publishedAt),
    });
  };

  for (const project of projects) {
    feed.addItem({
      title: project.title,
      description: project.description,
      id: `${siteConfig.url}/projects/${project.slug}`,
      link: `${siteConfig.url}/project/${project.slug}`,
      date: new Date(project.endDate),
    });
  }

  return new NextResponse(feed.rss2(), {
    headers: { "Content-Type": "application/xml" },
  });
}

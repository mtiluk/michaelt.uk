import path from "node:path";
import type { Blog } from "@/types/blogs";
import { Feed } from "feed";
import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site.config";
import getAllContent from "@/lib/content";

const blogDirectory = path.join(process.cwd(), "content/blogs");

export async function GET() {
  const [blogs] = await Promise.all([
    getAllContent<Blog>(blogDirectory),
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
  }

  return new NextResponse(feed.rss2(), {
    headers: { "Content-Type": "application/xml" },
  });
}

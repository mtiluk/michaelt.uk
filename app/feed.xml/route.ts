import { Feed } from "feed";
import { NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blogs";
import { siteConfig } from "@/lib/site.config";

export async function GET() {
  const posts = getAllBlogs();

  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: siteConfig.language,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    feedLinks: {
      rss: `https://${siteConfig.url}feed.xml`
    },
  });

  for (const post of posts) {
    feed.addItem({
      title: post.title,
      id: `https://${siteConfig.url}/blog/${post.slug}`,
      link: `https://${siteConfig.url}/blog/${post.slug}`,
      description: post.description,
      date: new Date(post.publishedAt),
    });
  }

  return new NextResponse(feed.rss2(), {
    headers: { "Content-Type": "application/xml" },
  });
}

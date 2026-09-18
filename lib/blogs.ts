import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Blog } from "@/types/blogs";

const blogDirectory = path.join(process.cwd(), "content/blogs");

export type BlogPost = Blog & { content: string };

type SeriesContext = {
  series: { title: string; slug: string };
  part: number;
  total: number;
  posts: BlogPost[];
};

function read(slug: string): BlogPost | null {
  let file: string;
  try {
    file = fs.readFileSync(path.join(blogDirectory, `${slug}.mdx`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(file);
  return { ...(data as Blog), slug, content };
}

export function getBlogs(): BlogPost[] {
  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(blogDirectory);
  } catch {
    return [];
  }

  return fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => read(fileName.slice(0, -".mdx".length)))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getBlog(slug: string): BlogPost | null {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) return null;
  return read(slug);
}

export function getSeriesContext(slug: string): SeriesContext | null {
  const current = getBlog(slug);
  if (!current?.series) return null;

  const posts = getBlogs()
    .filter((post) => post.series?.slug === current.series?.slug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return {
    series: current.series,
    part: posts.findIndex((post) => post.slug === slug) + 1,
    total: posts.length,
    posts,
  };
}

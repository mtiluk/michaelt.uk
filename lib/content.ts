import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type ContentItem<T> = T & {
  slug: string;
  content: string;
};

interface GetAllContentOptions<T> {
  sort?: (a: ContentItem<T>, b: ContentItem<T>) => number;
  extension?: string;
}


type WithSeries = {
  title: string;
  series?: { title: string; slug: string };
  order?: number;
};

export interface SeriesContext<T> {
  series: { title: string; slug: string };
  part: number;
  total: number;
  posts: ContentItem<T>[];
}

function getAllContent<T extends { title: string }>(  directory: string, options: GetAllContentOptions<T> = {}, ): ContentItem<T>[] {
  const { sort, extension = ".mdx" } = options;

  let fileNames: string[];
  try {
    fileNames = fs.readdirSync(directory);
  } catch {
    return [];
  }

  const items = fileNames
    .filter((fileName) => fileName.endsWith(extension))
    .map((fileName): ContentItem<T> => {
      const slug = fileName.slice(0, -extension.length);
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        ...(data as T),
        slug,
        content,
      };
    });

  return items.sort(sort ?? ((a, b) => a.title.localeCompare(b.title)));
}

export function getContentBySlug<T extends { title: string }>(
  directory: string,
  slug: string,
  extension = ".mdx",
): ContentItem<T> | null {
  if (slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    return null;
  }

  let fileContents: string;
  try {
    fileContents = fs.readFileSync(path.join(directory, `${slug}${extension}`), "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(fileContents);
  return { ...(data as T), slug, content };
}

export function getSeriesContext<T extends WithSeries>(
  directory: string,
  slug: string,
): SeriesContext<T> | null {
  const current = getContentBySlug<T>(directory, slug);
  if (!current?.series) return null;

  const seriesSlug = current.series.slug;
  const posts = getAllContent<T>(directory)
    .filter((post) => post.series?.slug === seriesSlug)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const part = posts.findIndex((post) => post.slug === slug) + 1;
  return { series: current.series, part, total: posts.length, posts };
}
export default getAllContent;

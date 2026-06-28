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

function getAllContent<T extends { title: string }>(
  directory: string,
  options: GetAllContentOptions<T> = {},
): ContentItem<T>[] {
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

export default getAllContent;

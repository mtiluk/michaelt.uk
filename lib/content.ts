import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type ContentItem<T> = T & {
  slug: string;
  content: string;
};

function getAllContent<T>(directory: string): ContentItem<T>[] {
  let fileNames: string[];

  try {
    fileNames = fs.readdirSync(directory);
  } catch {
    return [];
  }

  const items = fileNames
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, "");
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        ...(data as T),
        slug,
        content,
      };
    });

  return items.sort((a, b) => a.title.localeCompare(b.title));
}

export default getAllContent;

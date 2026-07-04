import GithubSlugger from "github-slugger";

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inCodeFence = false;

  for (const line of content.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      inCodeFence = !inCodeFence;
      continue;
    }
    if (inCodeFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!match) continue;

    const hashes = match[1];
    const text = match[2];
    if (!hashes || !text) continue;

    items.push({
      id: slugger.slug(text),
      text,
      level: hashes.length === 2 ? 2 : 3,
    });
  }

  return items;
}

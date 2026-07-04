// components/home/content/references.tsx
//
// "References" section for the bottom of each post. Two sources, merged:
//
//   1. CURATED — a `references:` list in the post's frontmatter, for
//      sources that deserve a proper title (papers, docs, talks):
//
//        references:
//          - https://redis.io/docs/latest/           # bare URL is fine
//          - title: How I Built My Blog
//            url: https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2/
//
//   2. AUTOMATIC — every external link that appears in the post body
//      (markdown `[text](url)` and raw <a href> tags), using the link
//      text as its title.
//
// Curated entries come first and win on duplicates (same URL linked in
// the body won't repeat). Internal/relative links and same-site links
// are ignored — references are for things that live elsewhere.
//
// This is a server component: extraction happens at build time, costs
// nothing on the client. Renders nothing if a post has no references.
//
// Usage:  <References content={blog.content} manual={blog.references} />
//
// (Add to your Blog type:
//    references?: (string | { title: string; url: string })[];  )
//

type ManualRef = string | { title: string; url: string };

type Reference = { title: string; url: string; host: string };

/** Links to these hosts are "internal" and never listed. */
const OWN_HOSTS = ["michaelt.uk", "www.michaelt.uk", "localhost"];

/** Normalize a URL for dedupe: strip hash and trailing slash. */
function normalize(url: string): string {
  return url.replace(/#.*$/, "").replace(/\/+$/, "");
}

function toReference(url: string, title?: string): Reference | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null; // relative or malformed — not a reference
  }
  if (!/^https?:$/.test(parsed.protocol)) return null;
  if (OWN_HOSTS.includes(parsed.hostname)) return null;

  return {
    url,
    host: parsed.hostname.replace(/^www\./, ""),
    // Fall back to a readable path when there's no link text/title.
    title:
      title?.trim() ||
      parsed.hostname.replace(/^www\./, "") +
        (parsed.pathname !== "/" ? parsed.pathname : ""),
  };
}

/** Pull every external link out of the raw MDX body. */
function extractFromContent(content: string): Reference[] {
  const found: Reference[] = [];

  // Markdown links: [text](https://...)
  for (const m of content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
    const ref = toReference(m[2], m[1]);
    if (ref) found.push(ref);
  }

  // Raw anchors: <a href="https://...">text</a>
  for (const m of content.matchAll(
    /<a\s[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>([^<]*)<\/a>/g,
  )) {
    const ref = toReference(m[1], m[2]);
    if (ref) found.push(ref);
  }

  return found;
}

export default function References({
  content,
  manual,
}: {
  content: string;
  manual?: ManualRef[];
}) {
  // Curated first — they're deliberate, so they lead and win on dedupe.
  const curated = (manual ?? [])
    .map((entry) =>
      typeof entry === "string"
        ? toReference(entry)
        : toReference(entry.url, entry.title),
    )
    .filter((ref): ref is Reference => ref !== null);

  const seen = new Set(curated.map((ref) => normalize(ref.url)));
  const discovered = extractFromContent(content).filter((ref) => {
    const key = normalize(ref.url);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const references = [...curated, ...discovered];
  if (references.length === 0) return null;

  return (
    <section className="mt-14 border-t border-foreground/10 pt-6">
      <p className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
        References
      </p>
      {/* A numbered list is honest structure here — references are the
          one place footnote-style numbering carries real meaning. */}
      <ol className="mt-3 space-y-1.5">
        {references.map((ref, i) => (
          <li key={ref.url} className="flex gap-2 text-[11px] leading-snug">
            <span className="w-4 shrink-0 text-right tabular-nums text-foreground/30">
              {i + 1}.
            </span>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group min-w-0"
            >
              <span className="text-foreground/70 transition-colors group-hover:text-text-highlight">
                {ref.title}
              </span>
              <span className="ml-1.5 text-foreground/30 transition-colors group-hover:text-foreground/45">
                {ref.host}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

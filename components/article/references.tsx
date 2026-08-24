import Link  from "next/link";

type ManualRef = string | { title: string; url: string };
type Reference = { title: string; url: string; host: string };

const base = process.env.NEXT_PUBLIC_SITE_URL
const OWN_HOSTS = [base, "localhost"];

function normalize(url: string): string {
  return url.replace(/#.*$/, "").replace(/\/+$/, "");
}

function toReference(url: string, title?: string): Reference | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (!/^https?:$/.test(parsed.protocol)) return null;
  if (OWN_HOSTS.includes(parsed.hostname)) return null;

  return {
    url,
    host: parsed.hostname.replace(/^www\./, ""),
    title:
      title?.trim() ||
      parsed.hostname.replace(/^www\./, "") +
        (parsed.pathname !== "/" ? parsed.pathname : ""),
  };
}

function extractFromContent(content: string): Reference[] {
  const found: Reference[] = [];

  for (const m of content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g)) {
    const ref = toReference(m[2], m[1]);
    if (ref) found.push(ref);
  }

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

      <ol className="mt-3 space-y-1.5">
        {references.map((ref, i) => (
          <li key={ref.url} className="flex gap-2 text-[11px] leading-snug">
            <span className="w-4 shrink-0 text-right tabular-nums text-foreground/30">
              {i + 1}.
            </span>
            <Link href={ref.url} target="_blank" rel="noopener noreferrer" className="group min-w-0" >
              <span className="text-foreground/70 transition-colors group-hover:text-text-highlight">
                {ref.title}
              </span>
              <span className="ml-1.5 text-foreground/30 transition-colors group-hover:text-foreground/45">
                {ref.host}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

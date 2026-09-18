export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  what?: string;
  why?: string;
  result?: string;
  status?: string;
  startDate: string;
  endDate: string;
  logo?: string;
  color?: string;
  github?: string;
  live?: string;
  writeup?: string;
  /** Tech stack tags (e.g. ["TypeScript", "Next.js"]). Rendered with a logo where recognised, see lib/tech.ts. */
  tech?: string[];
  /** Star count for `github`, fetched at request time - not set in the JSON. */
  stars?: number;
}

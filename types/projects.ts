export interface ProjectImage {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  status?: string;
  logo?: string;
  color?: string;
  what?: string;
  why?: string;
  result?: string;
  github?: string;
  writeup?: string;
  description: string;
  content: string;
  images?: ProjectImage[];
  /** Languages used, set manually in frontmatter (e.g. ["TypeScript", "Python"]). */
  languages?: string[];
  /** Star count for `github`, fetched at request time - not set in frontmatter. */
  stars?: number;
}

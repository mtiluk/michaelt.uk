export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  year: string;
  status?: string;
  logo?: string;
  color?: string;
  what?: string;
  why?: string;
  result?: string;
  github?: string;
  writeup?: string;
  images?: ProjectImage[];
  description: string;
  content: string;
}

export interface SeriesMeta {
  title: string;
  slug: string;
}

export interface Blog {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  timeToRead: string;
  series?: SeriesMeta;
  order?: number;
  references?: (string | { title: string; url: string })[];
}

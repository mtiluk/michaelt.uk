export interface Blog {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  timeToRead: string;
  references?: (string | { title: string; url: string })[];
}

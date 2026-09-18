import type { MetadataRoute } from 'next'
import { getBlogs } from '@/lib/blogs'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL
  if (!base) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set')
  }

  const posts = getBlogs()

  return [
    { url: base },
    { url: `${base}/blog` },
    { url: `${base}/projects` },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.publishedAt) })),
  ]
}

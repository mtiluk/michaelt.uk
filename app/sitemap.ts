import type { MetadataRoute } from 'next'
import path from 'node:path'
import getAllContent from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL
  if (!base) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set')
  }

  const posts = getAllContent<{ title: string }>(
    path.join(process.cwd(), 'content', 'blogs')
  )
  const projects = getAllContent<{ title: string }>(
    path.join(process.cwd(), 'content', 'projects')
  )

  // Fix type issues
  return [
    { url: base },
    { url: `${base}/blog` },
    { url: `${base}/projects` },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}` })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ]
}

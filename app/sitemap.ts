import type { MetadataRoute } from 'next'
import path from 'node:path'
import getAllContent from '@/lib/content'
import type { Blog } from '@/types/blogs'
import type { Project } from '@/types/projects'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL
  if (!base) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set')
  }

  const posts = getAllContent<Blog>(
    path.join(process.cwd(), 'content', 'blogs')
  )
  const projects = getAllContent<Project>(
    path.join(process.cwd(), 'content', 'projects')
  )

  return [
    { url: base },
    { url: `${base}/blog` },
    { url: `${base}/projects` },
    ...posts.map((p) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p.publishedAt) })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(p.endDate) })),
  ]
}

import type { MetadataRoute } from 'next'
import { getAllPosts } from '~/lib/content'
import { seo } from '~/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latest = posts[0]?.publishedAt ?? new Date()

  const baseRoutes = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/photos', priority: 0.8, changeFrequency: 'monthly' as const },
  ]

  return [
    ...baseRoutes.map((route) => ({
      url: new URL(route.path, seo.url).href,
      lastModified: latest,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...posts.map((post) => ({
      url: new URL(`/blog/${post.slug}`, seo.url).href,
      lastModified: post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}

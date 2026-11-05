import RSS from 'rss'
import { getAllPosts } from '~/lib/content'
import { brandConfig } from '~/lib/personal'
import { seo } from '~/lib/seo'

export function buildFeedXml(): string {
  const feed = new RSS({
    title: brandConfig.name,
    description: brandConfig.tagline,
    site_url: seo.url.href,
    feed_url: `${seo.url.href.replace(/\/$/, '')}/feed.xml`,
    language: 'zh-CN',
    image_url: new URL(brandConfig.avatar, seo.url).href,
    generator: `${brandConfig.enName} RSS Engine 1.0`,
    pubDate: new Date(),
  })

  for (const post of getAllPosts()) {
    const url = new URL(`/blog/${post.slug}`, seo.url).href
    feed.item({
      title: post.title,
      guid: url,
      url,
      description: post.summary || post.description || '',
      date: post.publishedAt,
      author: brandConfig.name,
      ...(post.cover && {
        enclosure: {
          url: new URL(post.cover.src, seo.url).href,
        },
      }),
    })
  }

  return feed.xml({ indent: true })
}

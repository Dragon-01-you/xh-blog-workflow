import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'

import { BrailleDate } from '~/components/braille-date'
import { PixelCluster } from '~/components/pixel-cluster'
import { PolaroidCover } from '~/components/polaroid-cover'
import { PostBody } from '~/components/post-body'
import { PostRow } from '~/components/post-row'
import { PostToc } from '~/components/post-toc'
import {
  buildPostRail,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
  POST_ARTICLE_START_ID,
} from '~/lib/content'
import { formatShortDate } from '~/lib/date'
import { T } from '~/lib/i18n'
import { renderMarkdown } from '~/lib/markdown'
import { brandConfig } from '~/lib/personal'
import { postViewTransitionName } from '~/lib/view-transition-name'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: '未找到文章' }

  return {
    title: `${post.title} | ${brandConfig.name}`,
    description: post.summary || post.description,
    openGraph: {
      title: `${post.title} | ${brandConfig.name}`,
      description: post.summary || post.description,
      type: 'article',
      publishedTime: post.publishedAt.toISOString(),
      images: post.cover?.src ? [post.cover.src] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps): Promise<React.JSX.Element> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const rail = buildPostRail(post.title, post.body)
  const railEn = post.bodyEn
    ? buildPostRail(post.titleEn ?? post.title, post.bodyEn, 'en-')
    : undefined

  const posts = getAllPosts()
  const postIndex = posts.findIndex((p) => p.slug === post.slug)
  const edition = String(posts.length - (postIndex >= 0 ? postIndex : 0)).padStart(3, '0')
  const plateDate = formatShortDate(post.publishedAt).replaceAll('/', '.')
  const related = getRelatedPosts(post.slug, 3)
  const clusterVariant = [...post.slug].reduce((sum, ch) => sum + ch.charCodeAt(0), 0)

  const renderedHtml = await renderMarkdown(post.body, { slug: post.slug })

  return (
    <>
      <PostToc nodes={rail} nodesEn={railEn} />

      <article className="post-article mx-auto w-full max-w-[37.5rem] px-6 space-y-8">
        <header>
          {post.cover && (
            <PolaroidCover
              slug={post.slug}
              cover={post.cover}
              caption={post.coverCaption || <BrailleDate date={post.publishedAt} />}
              priority
              morph
              print="collage"
              sizes="(max-width: 704px) 100vw, 656px"
            />
          )}

          <div className="post-title-card">
            <div className="mt-8 flex items-start justify-between gap-4">
              <h1
                id={POST_ARTICLE_START_ID}
                className="text-2xl font-bold tracking-tight text-balance text-[var(--foreground)]"
                style={
                  {
                    viewTransitionName: postViewTransitionName('title', post.slug),
                  } as React.CSSProperties
                }
              >
                <T zh={post.title} en={post.titleEn ?? post.title} />
              </h1>
              <PixelCluster variant={clusterVariant} className="mt-1.5 shrink-0" />
            </div>

            <dl className="post-title-meta spec-plate">
              <div>
                <dt>
                  <T zh="编号" en="No." />
                </dt>
                <dd>
                  <span className="spec-signal" aria-hidden="true" />
                  {edition}
                </dd>
              </div>

              <div>
                <dt>
                  <T zh="日期" en="Date" />
                </dt>
                <dd>
                  <time dateTime={post.publishedAt.toISOString()}>{plateDate}</time>
                </dd>
              </div>

              <div>
                <dt>
                  <T zh="时长" en="Length" />
                </dt>
                <dd>
                  <T
                    zh={`${post.readingMinutes} 分钟`}
                    en={`${post.readingMinutesEn ?? post.readingMinutes} min`}
                  />
                </dd>
              </div>

              <div>
                <dt>
                  <T zh="字数" en="Words" />
                </dt>
                <dd>
                  <T
                    zh={post.bodyUnits.toLocaleString('en-US')}
                    en={(post.bodyUnitsEn ?? post.bodyUnits).toLocaleString('en-US')}
                  />
                </dd>
              </div>
            </dl>
          </div>
        </header>

        <PostBody html={renderedHtml} />

        {related.length > 0 && (
          <aside
            className="post-related hairline-top pt-8"
            aria-labelledby="post-related-heading"
          >
            <h2 id="post-related-heading" className="post-related-label mb-3">
              <T zh="相关阅读" en="Posts like this" />
            </h2>
            <ul className="focus-list flex flex-col">
              {related.map((entry) => (
                <li key={entry.slug}>
                  <PostRow
                    post={entry}
                    headingLevel="h3"
                    dateStyle="short"
                  />
                </li>
              ))}
            </ul>
          </aside>
        )}
      </article>
    </>
  )
}

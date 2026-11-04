import type { Metadata } from 'next'
import React from 'react'

import { PixelCluster } from '~/components/pixel-cluster'
import { PostRow } from '~/components/post-row'
import { RevealScope } from '~/components/reveal-scope'
import { WritingInkStage } from '~/components/hidden-list-stage'
import { getAllPosts } from '~/lib/content'
import { T } from '~/lib/i18n'
import { brandConfig } from '~/lib/personal'

export const metadata: Metadata = {
  title: `写作 | ${brandConfig.name}`,
  description: '深度长文、AI 敏捷生产力与个人知识沉淀系统的探索构建手记。',
}

export default function BlogIndexPage(): React.JSX.Element {
  const posts = getAllPosts()
  const postsByYear = new Map<number, typeof posts>()

  for (const post of posts) {
    const year = post.publishedAt.getUTCFullYear()
    const yearPosts = postsByYear.get(year)
    if (yearPosts) yearPosts.push(post)
    else postsByYear.set(year, [post])
  }

  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6 space-y-6">
      <header className="enter flex items-center justify-between">
        <h1 className="page-eyebrow">
          <T zh="写作" en="Writing" />
        </h1>
        <PixelCluster variant={1} />
      </header>

      <WritingInkStage className="mt-6" contentClassName="flex flex-col gap-8">
        {[...postsByYear.entries()].map(([year, yearPosts]) => {
          const center = (yearPosts.length - 1) / 2

          return (
            <section key={year} aria-labelledby={`posts-${year}`} className="relative">
              {/* Ghost folio: Year stamp in background */}
              <span aria-hidden="true" className="ghost-folio">
                {String(year).slice(2)}
              </span>

              <h2
                id={`posts-${year}`}
                className="enter text-sm font-medium text-muted-foreground tabular-nums font-mono mb-2"
              >
                {year}
              </h2>

              <RevealScope as="ul" className="focus-list mt-2 flex flex-col">
                {yearPosts.map((post, index) => (
                  <li
                    key={post.slug}
                    className="enter-swing"
                    style={
                      {
                        '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
                      } as React.CSSProperties
                    }
                  >
                    <PostRow
                      post={post}
                      headingLevel="h3"
                      dateStyle="month-day"
                      listStageId={post.slug}
                    />
                  </li>
                ))}
              </RevealScope>
            </section>
          )
        })}
      </WritingInkStage>
    </div>
  )
}

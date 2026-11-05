import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { brandConfig } from '~/lib/personal'

export const metadata: Metadata = {
  title: `404 页面未找到 | ${brandConfig.name}`,
  description: '请求的页面未找到或已被归档。',
}

export default function NotFound(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6 py-20 flex flex-col items-center justify-center text-center space-y-8 enter">
      <div className="flex items-center justify-center space-x-3">
        <PixelCluster variant={2} />
        <span className="page-eyebrow font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Error 404
        </span>
      </div>

      <div className="space-y-3">
        <div className="text-8xl font-mono font-bold tracking-tighter text-[var(--signal)] select-none">
          404
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
          <T zh="页面未找到" en="Page Not Found" />
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
          <T
            zh="抱歉，您访问的页面在当前坐标不存在、已迁移或已被冷冻归档。"
            en="The page you requested could not be found, has been moved, or is permanently archived."
          />
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-mono font-medium tracking-wide border border-border bg-[var(--background)] hover:bg-[var(--card)] hover:border-[var(--foreground)] text-[var(--foreground)] transition-all shadow-sm group"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>
            <T zh="返回首页" en="Return Home" />
          </span>
        </Link>
      </div>
    </div>
  )
}

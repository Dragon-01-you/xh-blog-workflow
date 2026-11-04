import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PixelCluster } from '~/components/pixel-cluster'
import { T } from '~/lib/i18n'
import { getAllPosts } from '~/lib/content'
import { books, personalInfo, records } from '~/lib/personal'
import { photos } from '~/lib/photos'
import { projects } from '~/lib/projects'

export const metadata: Metadata = {
  title: '运营监控概览 | 芯火',
  description: '本地免密运营监控台与健康巡检概览。',
  robots: {
    index: false,
    follow: false,
  },
}

function MetricRow({
  href,
  label,
  value,
  status = 'default',
}: {
  href?: string
  label: React.ReactNode
  value: React.ReactNode
  status?: 'default' | 'success' | 'warning'
}): React.JSX.Element {
  const content = (
    <div className="group flex min-h-11 items-center gap-3 py-1.5 text-sm outline-none">
      <span className="shrink-0 text-[var(--foreground)] font-medium">{label}</span>
      <span aria-hidden="true" className="blog-row-leader" />
      <span
        className={`shrink-0 text-right tabular-nums font-mono ${
          status === 'success'
            ? 'text-[var(--signal)]'
            : status === 'warning'
            ? 'text-amber-500'
            : 'text-[var(--muted-foreground)]'
        }`}
      >
        {value}
      </span>
    </div>
  )

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="block hover:bg-[var(--card)] px-2 py-0.5 rounded transition-colors"
        >
          {content}
        </Link>
      </li>
    )
  }

  return <li className="px-2 py-0.5">{content}</li>
}

export default function AdminPage(): React.JSX.Element {
  const posts = getAllPosts()
  const totalWords = posts.reduce((sum, p) => sum + p.bodyUnits, 0)
  const totalReadingMinutes = posts.reduce((sum, p) => sum + p.readingMinutes, 0)

  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6 py-6 pb-16 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[var(--signal)] animate-pulse" />
            <h1 className="page-eyebrow text-sm font-semibold text-[var(--foreground)]">
              <T zh="运营监控概览 (免密沙盒)" en="Operational Monitor (Zero-Auth)" />
            </h1>
          </div>
          <p className="mt-1 text-xs text-[var(--muted-foreground)] font-mono">
            Direct local access · All systems nominal · Swiss Paper &amp; Ink
          </p>
        </div>
        <PixelCluster variant={6} className="shrink-0" />
      </div>

      {/* Section 1: 内容资产总览 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
          <span>01 // 内容资产汇总 (Content Metrics)</span>
          <span>COUNT</span>
        </div>
        <ul className="hairline-top divide-y divide-[var(--border)] border border-[var(--border)] rounded-md bg-[var(--surface-1)]">
          <MetricRow
            href="/blog"
            label={<T zh="镇店文章 (Published Articles)" en="Published Articles" />}
            value={`${posts.length} 篇`}
            status="success"
          />
          <MetricRow
            label={<T zh="文章总字数统计 (Total Words)" en="Total Word Count" />}
            value={`${totalWords.toLocaleString()} 字`}
          />
          <MetricRow
            label={<T zh="预估总阅读时间 (Reading Time)" en="Total Reading Time" />}
            value={`~${totalReadingMinutes} 分钟`}
          />
          <MetricRow
            href="/projects"
            label={<T zh="代表作工程项目 (Active Projects)" en="Active Projects" />}
            value={`${projects.length} 个`}
            status="success"
          />
          <MetricRow
            href="/photos"
            label={<T zh="拍立得影像条目 (Gallery Photos)" en="Gallery Photos" />}
            value={`${photos.length} 张`}
            status="success"
          />
          <MetricRow
            href="/#bookshelf"
            label={<T zh="珍藏书架书籍 (Curated Books)" en="Curated Books" />}
            value={`${books.length} 本`}
            status="success"
          />
          <MetricRow
            href="/#vinyl"
            label={<T zh="定番黑胶唱片 (Vinyl Records)" en="Vinyl Records" />}
            value={`${records.length} 首`}
            status="success"
          />
        </ul>
      </section>

      {/* Section 2: 发现与公开网关状态 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
          <span>02 // 发现网关基础设施 (Discovery Gateways)</span>
          <span>STATUS</span>
        </div>
        <ul className="hairline-top divide-y divide-[var(--border)] border border-[var(--border)] rounded-md bg-[var(--surface-1)]">
          <MetricRow
            href="/feed.xml"
            label="RSS 2.0 订阅源 (/feed.xml)"
            value="200 OK (Active)"
            status="success"
          />
          <MetricRow
            href="/sitemap.xml"
            label="动态站点地图 (/sitemap.xml)"
            value="200 OK (Indexed)"
            status="success"
          />
          <MetricRow
            href="/robots.txt"
            label="爬虫防御与指引 (/robots.txt)"
            value="Configured"
            status="success"
          />
          <MetricRow
            href="/llms.txt"
            label="AI 结构化说明书 (/llms.txt)"
            value="Ready (Markdown)"
            status="success"
          />
          <MetricRow
            label="构建环境版本 (Build Engine)"
            value="Next.js 15.3 (Static + Dynamic)"
          />
        </ul>
      </section>

      {/* Section 3: 社交渠道健康度 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
          <span>03 // 社交渠道与联系方式 (Channels Health)</span>
          <span>ENDPOINT</span>
        </div>
        <ul className="hairline-top divide-y divide-[var(--border)] border border-[var(--border)] rounded-md bg-[var(--surface-1)]">
          <MetricRow
            href={personalInfo.github}
            label="GitHub 账号"
            value={personalInfo.handle}
            status="success"
          />
          <MetricRow
            href={`mailto:${personalInfo.email}`}
            label="联络邮箱"
            value={personalInfo.email}
            status="success"
          />
          <MetricRow
            label="微信公众号"
            value={`「${personalInfo.weChatOfficial}」`}
            status="success"
          />
          <MetricRow
            href={personalInfo.xiaoHongShu}
            label="小红书主页"
            value="已配置"
            status="success"
          />
        </ul>
      </section>
    </div>
  )
}

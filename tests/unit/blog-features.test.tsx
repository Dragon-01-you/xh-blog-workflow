// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { describe, expect, it, beforeEach, vi } from 'vitest'
import React, { act } from 'react'
import { renderToString } from 'react-dom/server'
import { createRoot } from 'react-dom/client'

import { getAllPosts, getPostBySlug, buildPostRail } from '~/lib/content'
import { renderMarkdown } from '~/lib/markdown'
import { tiltFromSlug } from '~/lib/polaroid'
import { brailleDate } from '~/lib/braille'
import { postViewTransitionName } from '~/lib/view-transition-name'
import { formatMonthDay, formatShortDate } from '~/lib/date'
import { LanguageProvider } from '~/lib/i18n'
import { brandConfig } from '~/lib/personal'

import { PostRow } from '~/components/post-row'
import { PolaroidCover } from '~/components/polaroid-cover'
import { DitherVeil, DitheredImage } from '~/components/dither-veil'
import { PostToc } from '~/components/post-toc'
import { PixelCluster } from '~/components/pixel-cluster'
import { BrailleDate } from '~/components/braille-date'
import BlogIndexPage from '~/app/blog/page'
import BlogPostPage, { generateStaticParams, generateMetadata } from '~/app/blog/[slug]/page'

describe('04: Blog 博客列表与文章详情流水线 (Issue 04)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.locale
    delete document.documentElement.dataset.theme

    // Mock HTMLCanvasElement for jsdom
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(400).fill(128),
      }),
    })

    HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      width: 64,
      height: 44,
      top: 0,
      left: 0,
      right: 64,
      bottom: 44,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)

    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    )
  })

  describe('1. 博客列表页 (/blog/page.tsx) 与 PostRow', () => {
    it('renders the blog index page with page eyebrow and posts grouped by year', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <BlogIndexPage />
        </LanguageProvider>,
      )

      expect(html).toContain('写作')
      expect(html).toContain('Writing')
      // Contains ghost-folio print folio year numerals (e.g. 26 for 2026)
      expect(html).toContain('ghost-folio')
      expect(html).toContain('26')
      // Contains all published posts
      expect(html).toContain('停更两个月后，我想明白了一件事')
      expect(html).toContain('顶尖的开发者在出题，而我们只是在答卷')
    })

    it('renders PostRow with print-pile sheets, dithered thumbnail, dotted leader and date', () => {
      const posts = getAllPosts()
      expect(posts.length).toBeGreaterThan(0)
      const post = posts[0]

      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <PostRow post={post} headingLevel="h3" dateStyle="month-day" />
        </LanguageProvider>,
      )

      // Post title
      expect(html).toContain(post.title)
      // Print pile elements
      expect(html).toContain('print-pile')
      expect(html).toContain('print-pile-sheet')
      expect(html).toContain('print-thumb')
      // Dotted leader
      expect(html).toContain('blog-row-leader')
      // Date element
      expect(html).toContain(formatMonthDay(post.publishedAt))
      // View transition styling
      expect(html).toContain(postViewTransitionName('title', post.slug))
    })

    it('formats dates in various styles (full, month-day, short)', () => {
      const posts = getAllPosts()
      const post = posts[0]

      const htmlShort = renderToString(<PostRow post={post} dateStyle="short" />)
      expect(htmlShort).toContain(formatShortDate(post.publishedAt))

      const htmlMonthDay = renderToString(<PostRow post={post} dateStyle="month-day" />)
      expect(htmlMonthDay).toContain(formatMonthDay(post.publishedAt))
    })
  })

  describe('2. 文章详情页 (/blog/[slug]/page.tsx) 与元数据', () => {
    it('generates static params for all published posts', async () => {
      const params = await generateStaticParams()
      expect(params.length).toBeGreaterThan(0)
    })

    it('generates accurate metadata including OpenGraph tags for a post', async () => {
      const posts = getAllPosts()
      expect(posts.length).toBeGreaterThan(0)
      const targetSlug = posts[0].slug
      const metadata = await generateMetadata({
        params: Promise.resolve({ slug: targetSlug }),
      })

      expect(metadata.title).toContain(posts[0].title)
      expect(metadata.title).toContain(brandConfig.name)
      expect(metadata.description).toBeTruthy()
      expect((metadata.openGraph as Record<string, unknown>)?.type).toBe('article')
    })

    it('renders article details with PolaroidCover, spec-plate, body, and related posts', async () => {
      const posts = getAllPosts()
      expect(posts.length).toBeGreaterThan(0)
      const targetPost = posts[0]

      const pageJsx = await BlogPostPage({
        params: Promise.resolve({ slug: targetPost.slug }),
      })

      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">{pageJsx}</LanguageProvider>,
      )

      // Title card
      expect(html).toContain(targetPost.title)
      // Spec plate items: No., Date, Length, Words
      expect(html).toContain('spec-plate')
      expect(html).toContain('spec-signal')
      expect(html).toContain('编号')
      expect(html).toContain('日期')
      expect(html).toContain('时长')
      expect(html).toContain('字数')
      // Minimap ID
      expect(html).toContain('post-document-minimap')
      // Related posts section
      expect(html).toContain('post-related')
    })
  })

  describe('3. PolaroidCover 与 DitherVeil 16阶点阵网点', () => {
    it('computes deterministic tilt angles based on slug', () => {
      const tilt1 = tiltFromSlug('test-slug-alpha')
      const tilt2 = tiltFromSlug('different-slug-beta')
      const tilt3 = tiltFromSlug('test-slug-alpha')

      expect(tilt1).toBe(tilt3)
      expect(typeof tilt1).toBe('number')
      expect(tilt1).toBeGreaterThanOrEqual(-2)
      expect(tilt1).toBeLessThanOrEqual(2)
      expect(tilt1).not.toBe(tilt2)
    })

    it('renders PolaroidCover with print="collage" and dither canvas veil', () => {
      const post = getAllPosts()[0]
      const html = renderToString(
        <PolaroidCover
          slug={post.slug}
          cover={post.cover}
          caption={post.coverCaption}
          tilted
          print="collage"
        />,
      )

      expect(html).toContain('polaroid')
      expect(html).toContain('polaroid-tilted')
      expect(html).toContain('polaroid-photo')
      expect(html).toContain('dither-veil')
      expect(html).toContain('polaroid-caption')
      expect(html).toContain(post.coverCaption)
    })

    it('renders BrailleDate for tactile aesthetic representation', () => {
      const date = new Date('2026-11-01T10:00:00.000Z')
      const braille = brailleDate(date)
      expect(braille).toContain('⠼')

      const html = renderToString(<BrailleDate date={date} />)
      expect(html).toContain(braille)
      expect(html).toContain('sr-only')
    })

    it('attaches click handler on polaroid container to toggle Bayer dissolve', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const post = getAllPosts()[0]

      act(() => {
        root.render(
          <div className="polaroid">
            <DitheredImage
              src={post.cover.src}
              alt="test"
              width={1200}
              height={675}
              ditherMode="collage"
            />
          </div>,
        )
      })

      const canvas = container.querySelector('canvas.dither-veil')
      expect(canvas).not.toBeNull()

      act(() => {
        root.unmount()
      })
      container.remove()
    })
  })

  describe('4. PostToc 文章地图刻度尺导航与移动端灵动岛胶囊', () => {
    it('builds post rail with landmarks and gap ticks', () => {
      const post = getAllPosts()[0]
      const rail = buildPostRail(post.title, post.body)

      expect(rail.length).toBeGreaterThan(1)
      const titleNode = rail[0]
      expect(titleNode.kind).toBe('landmark')
      if (titleNode.kind === 'landmark') {
        expect(titleNode.id).toBe('post-article-start')
      }

      const headingNodes = rail.filter((n) => n.kind === 'landmark' && n.variant === 'heading')
      expect(headingNodes.length).toBeGreaterThan(0)

      const tickNodes = rail.filter((n) => n.kind === 'tick')
      expect(tickNodes.length).toBeGreaterThan(0)
    })

    it('renders PostToc with id="post-document-minimap" and progress circle', () => {
      const post = getAllPosts()[0]
      const rail = buildPostRail(post.title, post.body)

      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <PostToc nodes={rail} />
        </LanguageProvider>,
      )

      // Minimap ID
      expect(html).toContain('id="post-document-minimap"')
      // Reading progress circle with pathLength="1"
      expect(html).toContain('post-minimap-progress')
      expect(html).toContain('stroke-dasharray="0 1"')
      // Navigation landmarks
      expect(html).toContain('post-minimap-nodes')
      expect(html).toContain('post-minimap-toggle')
      expect(html).toContain('post-minimap-island')
      expect(html).toContain('post-minimap-back-to-top')
    })

    it('supports toggle expansion state in interactive DOM', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      const post = getAllPosts()[0]
      const rail = buildPostRail(post.title, post.body)

      act(() => {
        root.render(
          <LanguageProvider defaultLanguage="zh">
            <PostToc nodes={rail} />
          </LanguageProvider>,
        )
      })

      const toggleBtn = container.querySelector('button.post-minimap-toggle') as HTMLButtonElement
      expect(toggleBtn).not.toBeNull()

      // Initial state is collapsed
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('false')

      // Click to toggle
      act(() => {
        toggleBtn.click()
      })
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('true')

      // Click again to close
      act(() => {
        toggleBtn.click()
      })
      expect(toggleBtn.getAttribute('aria-expanded')).toBe('false')

      act(() => {
        root.unmount()
      })
      container.remove()
    })
  })

  describe('5. MDX / Markdown 内容渲染与 Shiki 代码高亮', () => {
    it('renders markdown to HTML with proper heading IDs matching rail landmarks', async () => {
      const markdown = `## 这是一个测试标题\n\n测试正文内容。\n\n\`\`\`ts\nconst x = 42;\n\`\`\``
      const html = await renderMarkdown(markdown)

      expect(html).toContain('id="这是一个测试标题"')
      expect(html).toContain('这是一个测试标题</h2>')
      expect(html).toContain('测试正文内容')
      // Shiki code block or styled pre/code
      expect(html).toContain('code-block')
      expect(html).toContain('42')
    })
  })
})

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { z } from 'zod'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

export const POST_ARTICLE_START_ID = 'post-article-start'
export const TICKS_BETWEEN_LANDMARKS = 3

function getScannedPostSlugs(): string[] {
  if (typeof process === 'undefined' || !fs.existsSync(POSTS_DIR)) {
    return [
      'reflecting-after-two-months',
      'concept-visualization',
      'top-developers-make-questions',
      'vibecoding-deployment-guide',
      'weekly-review-2026-06-15',
      'campus-data-card-for-alma-mater',
    ]
  }
  try {
    return fs
      .readdirSync(POSTS_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && fs.existsSync(path.join(POSTS_DIR, dirent.name, 'index.mdx')))
      .map((dirent) => dirent.name)
  } catch {
    return []
  }
}

export const publishedPostSlugs = getScannedPostSlugs()

export type PublishedPostSlug = string

const frontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  publishedAt: z.coerce.date().optional(),
  cover: z.string().optional(),
  coverWidth: z.number().int().positive().optional(),
  coverHeight: z.number().int().positive().optional(),
  coverCaption: z.string().optional(),
})

export interface PostCover {
  src: string
  width: number
  height: number
  caption?: string
  toString(): string
}

export interface Post {
  slug: string
  title: string
  titleEn?: string
  date: string
  publishedAt: Date
  summary: string
  description: string
  cover: PostCover
  coverCaption: string
  readingTime: number
  readingMinutes: number
  readingMinutesEn?: number
  bodyUnits: number
  bodyUnitsEn?: number
  body: string
  content: string
  bodyEn?: string
}

export type PostRailNode =
  | { key: string; kind: 'tick' }
  | {
      key: string
      kind: 'landmark'
      id: string
      label: string
      variant: 'title' | 'heading'
    }

const fencePattern = /^\s{0,3}(`{3,}|~{3,})/
const headingPattern = /^\s{0,3}(#{2,3})\s+(.+?)\s*$/

export function cleanHeading(raw: string): string {
  return raw
    .replace(/\s+#+\s*$/, '')
    .replace(/!?(?:\[([^\]]+)\])\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .trim()
}

export class SimpleSlugger {
  private occurrences = new Map<string, number>()

  slug(raw: string): string {
    const base = raw
      .toLowerCase()
      .trim()
      .replace(/[\s\t\n]+/g, '-')
      .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'

    const count = this.occurrences.get(base) ?? 0
    this.occurrences.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }
}

/**
 * 递归生成目录刻度轨道 (post-minimap)
 * 无论传入单一 content 字符串还是 (title, body, idPrefix)，均能无缝适配
 */
export function buildPostRail(
  titleOrContent: string,
  maybeBody?: string,
  idPrefix = ''
): PostRailNode[] {
  let title = '文章开始'
  let body = titleOrContent
  let prefix = idPrefix

  if (typeof maybeBody === 'string') {
    title = titleOrContent
    body = maybeBody
  } else {
    // 尝试从 frontmatter 或首个 # 一级标题提取标题
    try {
      const parsed = matter(titleOrContent)
      if (parsed.data.title) {
        title = parsed.data.title
        body = parsed.content
      } else {
        const firstH1 = titleOrContent.match(/^#\s+(.+)$/m)
        if (firstH1) {
          title = cleanHeading(firstH1[1])
        }
      }
    } catch {
      const firstH1 = titleOrContent.match(/^#\s+(.+)$/m)
      if (firstH1) {
        title = cleanHeading(firstH1[1])
      }
    }
  }

  const slugger = new SimpleSlugger()
  const lines = body.split(/\r?\n/)
  const nodes: PostRailNode[] = [
    {
      key: 'title',
      kind: 'landmark',
      id: POST_ARTICLE_START_ID,
      label: title,
      variant: 'title',
    },
  ]

  let index = 0
  let landmark = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }

    const fence = line.match(fencePattern)?.[1]
    if (fence) {
      const closingFence = new RegExp(`^\\s{0,3}${fence[0]}{${fence.length},}\\s*$`)
      index += 1
      while (index < lines.length && !closingFence.test(lines[index])) index += 1
      if (index < lines.length) index += 1
      continue
    }

    const heading = line.match(headingPattern)
    if (heading) {
      const label = cleanHeading(heading[2])
      for (let tick = 0; tick < TICKS_BETWEEN_LANDMARKS; tick += 1) {
        nodes.push({ key: `gap-${landmark}-${tick}`, kind: 'tick' })
      }
      nodes.push({
        key: `landmark-${landmark}`,
        kind: 'landmark',
        id: `${prefix}${slugger.slug(label)}`,
        label,
        variant: 'heading',
      })
      landmark += 1
      index += 1
      continue
    }

    index += 1
  }

  return nodes
}

// 统计字数与阅读时长（中文字符 ~300字/分，西文字词 ~200词/分）
export function bodyStats(body: string) {
  const text = body.replace(/```[\s\S]*?```/g, '')
  const cjk = (text.match(/[\u4e00-\u9fa5\u3040-\u30ff]/g) ?? []).length
  const words = (text.replace(/[\u4e00-\u9fa5\u3040-\u30ff]/g, ' ').match(/[A-Za-z0-9_-]+/g) ?? []).length
  return {
    units: cjk + words,
    minutes: Math.max(1, Math.round(cjk / 300 + words / 200)),
  }
}

export function isPublishedPostSlug(slug: string): boolean {
  return getScannedPostSlugs().includes(slug)
}

export function isPostSlug(slug: string): boolean {
  return isPublishedPostSlug(slug)
}

export function getPostBySlug(slug: string): Post | null {
  const postDir = path.join(POSTS_DIR, slug)
  const mdxPath = path.join(postDir, 'index.mdx')

  if (!fs.existsSync(mdxPath)) {
    return null
  }

  try {
    const raw = fs.readFileSync(mdxPath, 'utf8')
    const { data, content } = matter(raw)
    const fm = frontmatterSchema.parse(data)

    let titleEn: string | undefined
    let descriptionEn: string | undefined
    let bodyEn: string | undefined
    let statsEn = { units: 0, minutes: 1 }

    const enPath = path.join(postDir, 'index.en.mdx')
    if (fs.existsSync(enPath)) {
      const rawEn = fs.readFileSync(enPath, 'utf8')
      const { data: dataEn, content: contentEn } = matter(rawEn)
      titleEn = dataEn.title
      descriptionEn = dataEn.description ?? dataEn.summary
      bodyEn = contentEn
      statsEn = bodyStats(contentEn)
    }

    const stats = bodyStats(content)

    const rawDate = fm.date || (fm.publishedAt ? fm.publishedAt.toISOString() : new Date().toISOString())
    const publishedAt = fm.publishedAt ?? new Date(rawDate)
    const dateStr = rawDate.slice(0, 10)

    const summaryText = fm.summary ?? fm.description ?? ''
    const captionText = fm.coverCaption ?? ''

    const coverSrc = fm.cover?.startsWith('./')
      ? `/content/blog/${slug}/${fm.cover.slice(2)}`
      : (fm.cover || `/content/blog/${slug}/cover.jpg`)

    const cover: PostCover = {
      src: coverSrc,
      width: fm.coverWidth ?? 1200,
      height: fm.coverHeight ?? 675,
      caption: captionText,
      toString() {
        return this.src
      },
    }

    return {
      slug,
      title: fm.title,
      titleEn,
      date: dateStr,
      publishedAt,
      summary: summaryText,
      description: summaryText,
      cover,
      coverCaption: captionText,
      readingTime: stats.minutes,
      readingMinutes: stats.minutes,
      readingMinutesEn: statsEn.minutes,
      bodyUnits: stats.units,
      bodyUnitsEn: statsEn.units,
      body: content,
      content,
      bodyEn,
    }
  } catch (err) {
    console.error(`Error loading post: ${slug}`, err)
    return null
  }
}

export function getPost(slug: string): Post {
  const post = getPostBySlug(slug)
  if (!post) {
    throw new Error(`Post not found: ${slug}`)
  }
  return post
}

export function getAllPosts(): Post[] {
  const slugs = fs.existsSync(POSTS_DIR)
    ? fs
        .readdirSync(POSTS_DIR, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory() && fs.existsSync(path.join(POSTS_DIR, dirent.name, 'index.mdx')))
        .map((dirent) => dirent.name)
    : [...publishedPostSlugs]

  // 按预设白名单或已发现的目录提取并按发布时间倒序排列
  const posts: Post[] = []
  for (const slug of slugs) {
    const post = getPostBySlug(slug)
    if (post) {
      posts.push(post)
    }
  }

  return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

// ── 相关文章推荐计算（基于词频余弦相似度） ─────────────────────────
const STOP_WORDS = new Set([
  '的', '了', '和', '是', '在', '我', '有', '人', '这', '中', '大', '为', '上', '个',
  'the', 'and', 'for', 'you', 'are', 'but', 'not', 'with', 'this', 'that',
])

function addTerms(vector: Map<string, number>, text: string, weight: number) {
  const bump = (term: string) => vector.set(term, (vector.get(term) ?? 0) + weight)
  const clean = text.replace(/```[\s\S]*?```/g, ' ').toLowerCase()

  for (const run of clean.match(/[\u4e00-\u9fa5]+/g) ?? []) {
    if (run.length === 1) bump(run)
    for (let i = 0; i < run.length - 1; i += 1) bump(run.slice(i, i + 2))
  }
  for (const word of clean.match(/[a-z0-9]{3,}/g) ?? []) {
    if (!STOP_WORDS.has(word)) bump(word)
  }
}

function similarity(a: Map<string, number>, b: Map<string, number>) {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a]
  let dot = 0
  for (const [term, count] of small) {
    const other = large.get(term)
    if (other) dot += count * other
  }
  const norm = (vector: Map<string, number>) =>
    Math.sqrt([...vector.values()].reduce((sum, count) => sum + count * count, 0))
  return dot / (norm(a) * norm(b) || 1)
}

const postVectors = new Map<string, Map<string, number>>()

function postVector(post: Post) {
  const key = `${post.slug}:${post.body.length}:${(post.bodyEn ?? '').length}`
  const cached = postVectors.get(key)
  if (cached) return cached
  const vector = new Map<string, number>()
  addTerms(vector, `${post.title} ${post.titleEn ?? ''}`, 3)
  addTerms(vector, `${post.body} ${post.bodyEn ?? ''}`, 1)
  postVectors.set(key, vector)
  return vector
}

export function getRelatedPosts(slug: string, limit = 3): Post[] {
  const posts = getAllPosts()
  const current = posts.find((post) => post.slug === slug)
  if (!current) return []
  const target = postVector(current)

  return posts
    .filter((post) => post.slug !== slug)
    .map((post) => ({ post, score: similarity(target, postVector(post)) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.publishedAt.getTime() - a.post.publishedAt.getTime(),
    )
    .slice(0, limit)
    .map((entry) => entry.post)
}

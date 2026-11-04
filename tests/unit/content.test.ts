import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  buildPostRail,
  getAllPosts,
  getPostBySlug,
  type PostRailNode,
} from '~/lib/content'

describe('文章数据管线与 PostRail 迷你标尺目录 (Issue 04 Seam)', () => {
  const EXPECTED_SLUGS = [
    'reflecting-after-two-months',
    'concept-visualization',
    'top-developers-make-questions',
    'vibecoding-deployment-guide',
    'weekly-review-2026-06-15',
    'five-legal-security-labs',
    'kali-linux-penetration-testing-intro',
    'campus-data-card-for-alma-mater',
  ] as const

  it('1. getAllPosts() 返回 8 篇已发布文章，且包含全部必须字段', () => {
    const posts = getAllPosts()
    expect(posts).toHaveLength(8)

    const slugs = posts.map((p) => p.slug)
    for (const expectedSlug of EXPECTED_SLUGS) {
      expect(slugs).toContain(expectedSlug)
    }

    for (const post of posts) {
      expect(post.slug).toBeTruthy()
      expect(typeof post.slug).toBe('string')

      expect(post.title).toBeTruthy()
      expect(typeof post.title).toBe('string')

      expect(post.date).toBeTruthy()
      expect(typeof post.date).toBe('string')

      expect(post.summary).toBeTruthy()
      expect(typeof post.summary).toBe('string')

      expect(post.cover).toBeTruthy()
      // cover 既可以直接作为路径使用，也可以读取其 src
      const coverSrc = typeof post.cover === 'string' ? post.cover : post.cover?.src
      expect(coverSrc).toMatch(/\/content\/blog\/[a-z0-9-]+\/cover\.jpg$/)

      expect(post.coverCaption).toBeTruthy()
      expect(typeof post.coverCaption).toBe('string')

      expect(typeof post.readingTime).toBe('number')
      expect(post.readingTime).toBeGreaterThan(0)
    }

    // 严禁错别字：品牌名必须使用「芯火」
    const serialized = JSON.stringify(posts)
    expect(serialized).not.toContain('星火')
  })

  it('2. getPostBySlug(slug) 能读取特定文章正文且不存在时返回 null/undefined', () => {
    const post = getPostBySlug('reflecting-after-two-months')
    expect(post).toBeDefined()
    expect(post?.slug).toBe('reflecting-after-two-months')
    expect(post?.title).toBe('停更两个月后，我想明白了一件事')
    expect(post?.summary).toContain('脱离 AI')
    expect(post?.coverCaption).toBe('停更两个月，我想明白了一件事：成果不是你的，流程才是')

    // 验证正文完整读取
    const content = post?.content || post?.body
    expect(content).toBeTruthy()
    expect(content).toContain('成果不是你的，流程才是')

    // 不存在的 slug 优雅处理
    const missing = getPostBySlug('not-exist-slug')
    expect(missing).toBeFalsy()
  })

  it('3. buildPostRail(content) 将 ## 和 ### 准确解析为 landmark，且相邻 landmark 间插入 3 个 tick 短刻度', () => {
    const sampleContent = `
# 用 AI 最怕的不是不会，而是走错门

导语段落。

## 一、走错门比不会更可怕

正文段落第一节。

### 1.1 提示词工匠的虚假繁荣

段落细节分析。

### 1.2 Agent 编排的现实边界

段落细节探讨。

## 二、从单点指令到工作流闭环

系统级闭环。
`

    const nodes: PostRailNode[] = buildPostRail(sampleContent)

    // 提取所有 landmark 节点
    const landmarks = nodes.filter((n) => n.kind === 'landmark')
    expect(landmarks.length).toBe(5) // 1 个 title + 4 个 heading

    // 首个节点为 title
    expect(landmarks[0].variant).toBe('title')
    expect(landmarks[0].id).toBe('post-article-start')

    // 后续节点均为 heading
    expect(landmarks[1].variant).toBe('heading')
    expect(landmarks[1].label).toBe('一、走错门比不会更可怕')

    expect(landmarks[2].variant).toBe('heading')
    expect(landmarks[2].label).toBe('1.1 提示词工匠的虚假繁荣')

    expect(landmarks[3].variant).toBe('heading')
    expect(landmarks[3].label).toBe('1.2 Agent 编排的现实边界')

    expect(landmarks[4].variant).toBe('heading')
    expect(landmarks[4].label).toBe('二、从单点指令到工作流闭环')

    // 核心断言：任意两个相邻 landmark 之间，必须恰好有 3 个 kind: 'tick' 节点
    let landmarkIndices: number[] = []
    nodes.forEach((node, idx) => {
      if (node.kind === 'landmark') {
        landmarkIndices.push(idx)
      }
    })

    for (let i = 0; i < landmarkIndices.length - 1; i++) {
      const currentIdx = landmarkIndices[i]
      const nextIdx = landmarkIndices[i + 1]
      const gapNodes = nodes.slice(currentIdx + 1, nextIdx)

      expect(gapNodes).toHaveLength(3)
      for (const gapNode of gapNodes) {
        expect(gapNode.kind).toBe('tick')
      }
    }
  })

  it('4. 校验 content/blog/<slug>/cover.jpg 在 8 篇文章目录下真实存在', () => {
    const cwd = process.cwd()
    const contentDir = path.join(cwd, 'content/blog')

    for (const slug of EXPECTED_SLUGS) {
      const coverPath = path.join(contentDir, slug, 'cover.jpg')
      expect(fs.existsSync(coverPath)).toBe(true)

      const mdxPath = path.join(contentDir, slug, 'index.mdx')
      expect(fs.existsSync(mdxPath)).toBe(true)
    }
  })
})

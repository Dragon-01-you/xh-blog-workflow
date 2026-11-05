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

  it('1. getAllPosts() 返回已发布文章，且包含全部必须字段', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)

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

    // 严禁错别字：严禁出现“星火”
    const serialized = JSON.stringify(posts)
    expect(serialized).not.toContain('星火')
  })

  it('2. getPostBySlug(slug) 能读取特定文章正文且不存在时返回 null/undefined', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)
    const targetSlug = posts[0].slug
    const post = getPostBySlug(targetSlug)
    expect(post).toBeDefined()
    expect(post?.slug).toBe(targetSlug)
    expect(post?.title).toBeTruthy()
    expect(post?.coverCaption).toBeTruthy()

    // 验证正文完整读取
    const content = post?.content || post?.body
    expect(content).toBeTruthy()

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

  it('4. 校验 content/blog/<slug>/cover.jpg 在文章目录下真实存在', () => {
    const cwd = process.cwd()
    const contentDir = path.join(cwd, 'content/blog')
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)

    for (const post of posts) {
      const coverPath = path.join(contentDir, post.slug, 'cover.jpg')
      expect(fs.existsSync(coverPath)).toBe(true)

      const mdxPath = path.join(contentDir, post.slug, 'index.mdx')
      expect(fs.existsSync(mdxPath)).toBe(true)
    }
  })
})

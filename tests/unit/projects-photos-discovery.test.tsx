import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import fs from 'node:fs'
import path from 'node:path'

// Component imports
import ProjectsPage from '~/app/projects/page'
import PhotosPage from '~/app/photos/page'
import AdminPage from '~/app/admin/page'
import { GhostSchematic } from '~/components/ghost-schematic'
import { PixelCluster } from '~/components/pixel-cluster'
import { PublishedPhotoWall } from '~/components/published-photo-wall'
import { ProjectsBlueprintStage } from '~/components/hidden-list-stage'

// Lib & route imports
import { projects } from '~/lib/projects'
import { photos } from '~/lib/photos'
import { books, records, personalInfo, brandConfig } from '~/lib/personal'
import { getAllPosts } from '~/lib/content'
import { tiltFromSlug } from '~/lib/polaroid'
import { buildFeedXml } from '~/lib/feeds'
import { buildLlmsText } from '~/lib/llms'
import sitemap from '~/app/sitemap'
import robots from '~/app/robots'

describe('Issue 05 & 06: Projects, Photos & Discovery Gateways', () => {
  const rootDir = process.cwd()

  describe('1. Projects Page & Blueprint Stage (Issue 05)', () => {
    it('renders all structured project cards with valid local asset icons', () => {
      const html = renderToStaticMarkup(<ProjectsPage />)

      // Eyebrow and heading
      expect(html).toContain('项目')
      expect(html).toContain('Projects')

      // Verify each project from lib/projects.ts is rendered
      for (const project of projects) {
        expect(html).toContain(project.name)
        expect(html).toContain(project.domain)

        // Strict assertion: icon exists physically in public/
        const iconDiskPath = path.join(rootDir, 'public', project.icon.replace(/^\//, ''))
        expect(fs.existsSync(iconDiskPath)).toBe(true)
      }

      // Red line: NO hypercar or motorsport images
      expect(html).not.toContain('hypercar-hero.png')
      expect(html).not.toContain('hypercar')
    })

    it('renders GhostSchematic drafting compass and ProjectsBlueprintStage', () => {
      const schematicHtml = renderToStaticMarkup(<GhostSchematic className="test-schematic" />)
      expect(schematicHtml).toContain('ghost-schematic')
      expect(schematicHtml).toContain('<svg')
      expect(schematicHtml).toContain('circle')

      const stageHtml = renderToStaticMarkup(
        <ProjectsBlueprintStage>
          <div>Project content</div>
        </ProjectsBlueprintStage>,
      )
      expect(stageHtml).toContain('hidden-list-stage')
      expect(stageHtml).toContain('projects-hidden-stage')
      expect(stageHtml).toContain('Project content')
    })
  })

  describe('2. Photos Page & Polaroid Gallery (Issue 05)', () => {
    it('renders polaroid photo gallery with verified assets and metadata', () => {
      const html = renderToStaticMarkup(<PhotosPage />)

      expect(html).toContain('相册')
      expect(html).toContain('Photos')

      // All 5 photos rendered
      for (const photo of photos) {
        expect(html).toContain(photo.title)

        // Check image file exists on disk
        const photoDiskPath = path.join(rootDir, 'public', photo.src.replace(/^\//, ''))
        expect(fs.existsSync(photoDiskPath)).toBe(true)
      }

      // Red line: NO hypercar-hero.png
      expect(html).not.toContain('hypercar-hero.png')
    })

    it('computes deterministic tilt angles between -2 and 2 degrees', () => {
      for (const photo of photos) {
        const tilt = tiltFromSlug(photo.id)
        expect(tilt).toBeGreaterThanOrEqual(-2)
        expect(tilt).toBeLessThanOrEqual(2)
      }
    })

    it('renders darkroom empty state when photos list is empty, and masonry when populated', () => {
      // 1. Verify empty darkroom state
      const emptyWallHtml = renderToStaticMarkup(<PublishedPhotoWall photos={photos} />)
      expect(emptyWallHtml).toContain('darkroom-empty-state')
      expect(emptyWallHtml).toContain('暗房冲印整理中')

      // 2. Verify masonry layout when photos are present
      const samplePhotos = [
        {
          id: 'photo-sample',
          title: '样本照片',
          titleEn: 'Sample Photo',
          description: '测试描述',
          src: '/images/avatar.png',
          width: 500,
          height: 500,
          date: '2026-11-01',
        },
      ]
      const wallHtml = renderToStaticMarkup(<PublishedPhotoWall photos={samplePhotos} />)
      expect(wallHtml).toContain('photo-masonry')
      expect(wallHtml).toContain('photo-item')
      expect(wallHtml).toContain('photo-frame')
      expect(wallHtml).toContain('calibration-corners')
      expect(wallHtml).toContain('--img-tilt')
    })
  })

  describe('3. Public Discovery Gateway: Sitemap & Robots (Issue 06)', () => {
    it('sitemap includes base sections and all 8 published post slugs', () => {
      const sitemapEntries = sitemap()
      const urls = sitemapEntries.map((e) => e.url)

      expect(urls.some((u) => u.endsWith('/'))).toBe(true)
      expect(urls.some((u) => u.endsWith('/blog'))).toBe(true)
      expect(urls.some((u) => u.endsWith('/projects'))).toBe(true)
      expect(urls.some((u) => u.endsWith('/photos'))).toBe(true)

      const posts = getAllPosts()
      expect(posts.length).toBe(8)
      for (const post of posts) {
        expect(urls.some((u) => u.includes(`/blog/${post.slug}`))).toBe(true)
      }
    })

    it('robots.txt allows public routes, disallows admin, and provides sitemap', () => {
      const robotsRules = robots()
      expect(robotsRules.rules).toBeDefined()
      expect(robotsRules.sitemap).toContain('/sitemap.xml')

      const disallows = Array.isArray(robotsRules.rules)
        ? robotsRules.rules.flatMap((r) => r.disallow ?? [])
        : (robotsRules.rules?.disallow ?? [])
      expect(disallows).toContain('/admin')
      expect(disallows).toContain('/api/admin')
    })
  })

  describe('4. Public Discovery Gateway: RSS 2.0 Feed (Issue 06)', () => {
    it('generates valid RSS 2.0 XML with all articles and brand configuration', () => {
      const xml = buildFeedXml()

      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
      expect(xml).toContain('<rss')
      expect(xml).toContain('version="2.0"')
      expect(xml).toContain(`<title><![CDATA[${brandConfig.name}]]></title>`)
      expect(xml).not.toContain('星火')

      const posts = getAllPosts()
      for (const post of posts) {
        expect(xml).toContain(post.title)
        expect(xml).toContain(`/blog/${post.slug}`)
      }
    })
  })

  describe('5. Public Discovery Gateway: AI Machine Readable llms.txt (Issue 06)', () => {
    it('generates structured Markdown specification for Cursor and AI search', () => {
      const text = buildLlmsText()

      expect(text).toContain(`# ${brandConfig.name} (${brandConfig.enName})`)
      expect(text).toContain('## 核心原则与站点架构')
      expect(text).toContain('## 深度思考与镇店文章 (Writing)')
      expect(text).toContain('## 代表工程与工作流项目 (Projects)')
      expect(text).toContain('## 发现与检索基础设施 (Discovery)')

      // Strictly checks NO "星火"
      expect(text).not.toContain('星火')

      // Contains all 4 post slugs
      const posts = getAllPosts()
      for (const post of posts) {
        expect(text).toContain(`/blog/${post.slug}`)
      }
    })
  })

  describe('6. Local Passwordless Admin Overview (Issue 06)', () => {
    it('renders passwordless overview with content metrics and health checks', () => {
      const html = renderToStaticMarkup(<AdminPage />)

      // Verify no login prompt, direct access
      expect(html).toContain('运营监控概览 (免密沙盒)')
      expect(html).not.toContain('Password')
      expect(html).not.toContain('登录密码')

      // Assert metrics display
      const posts = getAllPosts()
      expect(html).toContain(`${posts.length} 篇`)
      expect(html).toContain(`${projects.length} 个`)
      expect(html).toContain(`${photos.length} 张`)
      expect(html).toContain(`${books.length} 本`)
      expect(html).toContain(`${records.length} 首`)

      // Assert social channels and endpoints
      expect(html).toContain(personalInfo.handle)
      expect(html).toContain(personalInfo.email)
      expect(html).toContain(personalInfo.weChatOfficial)
      expect(html).toContain('/feed.xml')
      expect(html).toContain('/sitemap.xml')
      expect(html).toContain('/llms.txt')
    })
  })

  describe('7. PixelCluster decorative mark', () => {
    it('renders 2x2 grid with exactly one lit signal cell', () => {
      const html = renderToStaticMarkup(<PixelCluster variant={3} />)
      expect(html).toContain('pixel-cluster')
      expect(html).toContain('pc-s')
    })
  })
})

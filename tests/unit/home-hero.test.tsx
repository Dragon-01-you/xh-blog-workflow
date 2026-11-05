// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { describe, expect, it, beforeEach, vi, afterEach } from 'vitest'
import React, { act } from 'react'
import { renderToString } from 'react-dom/server'
import { createRoot } from 'react-dom/client'

import { HalftonePortrait } from '~/components/halftone-portrait'
import { PortraitHiddenStage } from '~/components/portrait-hidden-stage'
import { HomeIntroduction } from '~/components/home-introduction'
import { NavCards } from '~/components/nav-cards'
import { LanguageProvider } from '~/lib/i18n'
import { brandConfig, personalInfo } from '~/lib/personal'

describe('02: Home Hero, HalftonePortrait & NavCards (Issue 02)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.locale
    delete document.documentElement.dataset.theme

    // Mock HTMLCanvasElement.prototype.getContext for jsdom
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      drawImage: vi.fn(),
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(400),
      }),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      globalAlpha: 1,
      fillStyle: '#000',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('1. HalftonePortrait (components/halftone-portrait.tsx)', () => {
    it('binds light and dark image sources with hidden preloaders and canvas accessibility', () => {
      const html = renderToString(
        <HalftonePortrait
          srcLight="/images/headshot.jpg"
          srcDark="/images/portrait-square.jpg"
          alt="芯火的半色调网点肖像"
          altEn="Xinhuo halftone portrait"
        />
      )

      expect(html).toContain('data-halftone')
      expect(html).toContain('/images/headshot.jpg')
      expect(html).toContain('/images/portrait-square.jpg')
      expect(html).toContain('role="img"')
      expect(html).toContain('aria-label="芯火的半色调网点肖像"')
      expect(html).toContain('data-real-photo')
    })

    it('triggers click / onToggleStage callback and toggles true-color photo reveal', () => {
      const onToggle = vi.fn()
      const onClick = vi.fn()
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      act(() => {
        root.render(
          <HalftonePortrait
            srcLight="/images/headshot.jpg"
            srcDark="/images/portrait-square.jpg"
            alt="芯火的肖像"
            altEn="Xinhuo's portrait"
            onToggleStage={onToggle}
            onClick={onClick}
          />
        )
      })

      const trigger = container.querySelector('[data-halftone]') as HTMLElement
      expect(trigger).not.toBeNull()
      expect(trigger.getAttribute('data-revealed')).toBe('false')

      // First click: reveals true-color photograph
      act(() => {
        trigger.click()
      })

      expect(onToggle).toHaveBeenCalled()
      expect(onClick).toHaveBeenCalled()
      expect(trigger.getAttribute('data-revealed')).toBe('true')

      // Second click: returns to newspaper halftone dots
      act(() => {
        trigger.click()
      })
      expect(trigger.getAttribute('data-revealed')).toBe('false')

      act(() => {
        root.unmount()
      })
      container.remove()
    })

    it('supports reduced-motion preference gracefully without crashing', () => {
      vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })))

      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      expect(() => {
        act(() => {
          root.render(
            <HalftonePortrait
              srcLight="/images/headshot.jpg"
              srcDark="/images/portrait-square.jpg"
              alt="芯火的肖像"
              altEn="Xinhuo's portrait"
            />
          )
        })
      }).not.toThrow()

      act(() => {
        root.unmount()
      })
      container.remove()
    })
  })

  describe('2. PortraitHiddenStage (components/portrait-hidden-stage.tsx)', () => {
    it('renders authentic stage with 5-layer contour paths and manages active state on interaction', () => {
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      act(() => {
        root.render(
          <PortraitHiddenStage label="展开隐藏等高线舞台">
            <span data-testid="portrait-child">Portrait Canvas</span>
          </PortraitHiddenStage>
        )
      })

      const stage = container.querySelector('[data-portrait-stage]') as HTMLElement
      expect(stage).not.toBeNull()
      // Initial state is inactive
      expect(stage.getAttribute('data-active')).toBe('false')

      // Fallback SVG with 5 contour paths
      const fallbackSvg = container.querySelector('[data-hidden-stage-fallback]') as SVGElement
      expect(fallbackSvg).not.toBeNull()
      const paths = fallbackSvg.querySelectorAll('path')
      expect(paths.length).toBe(5)

      // Trigger button
      const trigger = container.querySelector('.portrait-hidden-stage-trigger') as HTMLButtonElement
      expect(trigger).not.toBeNull()

      // Click to toggle / reveal
      act(() => {
        trigger.click()
      })
      expect(stage.getAttribute('data-active')).toBe('true')

      // Click trigger again to collapse
      act(() => {
        trigger.click()
      })
      expect(stage.getAttribute('data-active')).toBe('false')

      act(() => {
        root.unmount()
      })
      container.remove()
    })

    it('falls back to static SVG contours when reduced-motion is requested', () => {
      vi.stubGlobal('matchMedia', vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
      })))

      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      act(() => {
        root.render(
          <PortraitHiddenStage label="隐藏舞台">
            <span>Portrait</span>
          </PortraitHiddenStage>
        )
      })

      const trigger = container.querySelector('.portrait-hidden-stage-trigger') as HTMLButtonElement
      act(() => {
        trigger.click()
      })

      const stage = container.querySelector('[data-portrait-stage]') as HTMLElement
      expect(stage.getAttribute('data-motion')).toBe('false')
      expect(stage.getAttribute('data-active')).toBe('true')

      act(() => {
        root.unmount()
      })
      container.remove()
    })
  })

  describe('3. HomeIntroduction (components/home-introduction.tsx)', () => {
    it('renders the brand title strictly without "星火" or marketing buzzwords', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <HomeIntroduction />
        </LanguageProvider>
      )

      // Strict brand name enforcement
      expect(html).toContain(brandConfig.name)
      expect(html).not.toContain('星火')

      // Sincere, restrained text verification
      expect(html).toContain('AI 全栈构建者')
      expect(html).toContain('刚')
      expect(html).toContain('好')

      // Red line: NO marketing buzzwords
      expect(html).not.toContain('公域')
      expect(html).not.toContain('私域')
      expect(html).not.toContain('一人公司')

      // Contains contact / social links
      expect(html).toContain(personalInfo.email)
    })
  })

  describe('4. NavCards (components/nav-cards.tsx)', () => {
    it('renders three doorways linking to /blog, /projects, /photos with geometric SVG lines', () => {
      const html = renderToString(
        <LanguageProvider defaultLanguage="zh">
          <NavCards postCount={12} projectCount={4} photoCount={6} />
        </LanguageProvider>
      )

      // Routes check
      expect(html).toContain('href="/blog"')
      expect(html).toContain('href="/projects"')
      expect(html).toContain('href="/photos"')

      // Labels check
      expect(html).toContain('写作')
      expect(html).toContain('项目')
      expect(html).toContain('相册')

      // Quantities check
      expect(html).toContain('12')
      expect(html).toContain('4')
      expect(html).toContain('6')

      // SVG geometric lines check
      // Projects geometric construction guides SVG
      expect(html).toContain('nc-construction-guides')
      // Manuscript sheets vignette
      expect(html).toContain('nc-sheets')
      // Polaroid fan vignette
      expect(html).toContain('nc-polaroids')
    })
  })
})

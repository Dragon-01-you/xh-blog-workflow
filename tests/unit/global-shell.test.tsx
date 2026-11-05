// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import { describe, expect, it, beforeEach, vi } from 'vitest'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { act } from 'react'
import { createRoot } from 'react-dom/client'

import {
  personalInfo,
  brandConfig,
  navItems,
  records,
  books,
} from '~/lib/personal'
import { LanguageProvider, useLanguage, T } from '~/lib/i18n'
import { ThemeProvider, useTheme } from '~/lib/theme'
import { soundEnabled, setSoundEnabled, playMechanicalSound, playDockSound } from '~/lib/sound'
import { BottomDock, DOCK_NAV_ITEMS } from '~/components/bottom-dock'
import { SiteFooter } from '~/components/site-footer'
import { FooterClock } from '~/components/footer-clock'

describe('01: Global Shell, Bottom Dock & Swiss Colophon (Public Seams)', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    delete document.documentElement.dataset.locale
    delete document.documentElement.dataset.theme
  })

  describe('1. Personal Profile & Brand Integrity (lib/personal.ts)', () => {
    it('enforces brand name to strictly be defined without typos', () => {
      expect(brandConfig.name).toBeTruthy()
      expect(brandConfig.enName).toBeTruthy()
      expect(personalInfo.name).toBe(brandConfig.name)
      expect(JSON.stringify(brandConfig)).not.toContain('星火')
      expect(JSON.stringify(personalInfo)).not.toContain('星火')
    })

    it('defines primary navigation routes: /, /blog, /projects, /photos', () => {
      const routes = navItems.map((item) => item.href)
      expect(routes).toContain('/')
      expect(routes).toContain('/blog')
      expect(routes).toContain('/projects')
      expect(routes).toContain('/photos')
    })

    it('contains verified records and books for personal brand', () => {
      expect(records.length).toBeGreaterThan(0)
      expect(books.length).toBeGreaterThan(0)
      expect(records[0].album).toBeTruthy()
      expect(books[0].title).toBeTruthy()
    })
  })

  describe('2. Internationalization & <T> Component (lib/i18n.tsx)', () => {
    it('renders <T> with both zh and en spans by default for CSS switching', () => {
      const html = renderToString(<T zh="写作" en="Writing" />)
      expect(html).toContain('data-zh')
      expect(html).toContain('data-en')
      expect(html).toContain('写作')
      expect(html).toContain('Writing')
    })

    it('LanguageProvider manages active language and updates html document dataset', () => {
      let currentLang = ''
      function TestConsumer() {
        const { language, setLanguage } = useLanguage()
        currentLang = language
        return (
          <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}>
            Toggle
          </button>
        )
      }

      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      act(() => {
        root.render(
          <LanguageProvider defaultLanguage="zh">
            <TestConsumer />
          </LanguageProvider>
        )
      })

      expect(currentLang).toBe('zh')
      expect(document.documentElement.lang).toBe('zh-CN')

      const button = container.querySelector('button')!
      act(() => {
        button.click()
      })

      expect(currentLang).toBe('en')
      expect(document.documentElement.dataset.locale).toBe('en')
      expect(document.documentElement.lang).toBe('en')

      root.unmount()
      container.remove()
    })
  })

  describe('3. Web Audio & Mechanical Sound (lib/sound.ts)', () => {
    it('manages sound toggle state and persists to storage', () => {
      setSoundEnabled(true)
      expect(soundEnabled()).toBe(true)
      expect(localStorage.getItem('sound')).toBe('on')

      setSoundEnabled(false)
      expect(soundEnabled()).toBe(false)
      expect(localStorage.getItem('sound')).toBe('off')
    })

    it('safely triggers sound playback functions without throwing', () => {
      setSoundEnabled(true)
      expect(() => playMechanicalSound('shutter')).not.toThrow()
      expect(() => playDockSound()).not.toThrow()

      setSoundEnabled(false)
      expect(() => playMechanicalSound('click')).not.toThrow()
    })
  })

  describe('4. Theme & View Transition (lib/theme.tsx)', () => {
    it('switches between light and dark themes updating documentElement', () => {
      let currentTheme = ''
      let toggleFn: () => void = () => {}

      function TestThemeConsumer() {
        const { theme, toggleTheme } = useTheme()
        currentTheme = theme
        toggleFn = toggleTheme
        return <div data-testid="theme-val">{theme}</div>
      }

      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)

      act(() => {
        root.render(
          <ThemeProvider defaultTheme="light">
            <TestThemeConsumer />
          </ThemeProvider>
        )
      })

      expect(currentTheme).toBe('light')
      expect(document.documentElement.classList.contains('light')).toBe(true)

      // Test fallback when startViewTransition is absent
      act(() => {
        toggleFn()
      })

      expect(currentTheme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(document.documentElement.style.colorScheme).toBe('dark')

      root.unmount()
      container.remove()
    })
  })

  describe('5. Bottom Dock & Navigation (components/bottom-dock.tsx)', () => {
    it('exports navigation items matching primary routes without "星火"', () => {
      expect(DOCK_NAV_ITEMS.map((i) => i.href)).toEqual(['/', '/blog', '/projects', '/photos'])
      const dockHtml = renderToString(
        <ThemeProvider>
          <LanguageProvider>
            <BottomDock />
          </LanguageProvider>
        </ThemeProvider>
      )
      expect(dockHtml).toContain(brandConfig.name)
      expect(dockHtml).not.toContain('星火')
      expect(dockHtml).toContain('href="/blog"')
      expect(dockHtml).toContain('href="/projects"')
      expect(dockHtml).toContain('href="/photos"')
    })
  })

  describe('6. Site Colophon & Footer Clock (components/site-footer.tsx)', () => {
    it('renders Swiss colophon with brand copyright and UTC+8 clock', () => {
      const footerHtml = renderToString(
        <LanguageProvider>
          <SiteFooter />
        </LanguageProvider>
      )
      expect(footerHtml).toContain(brandConfig.name)
      expect(footerHtml).not.toContain('星火')
      expect(footerHtml).toContain(brandConfig.timezoneLabel || 'UTC+8')
    })

    it('FooterClock renders without error', () => {
      const clockHtml = renderToString(<FooterClock />)
      expect(clockHtml).toContain('footer-local-clock')
      expect(clockHtml).toContain(brandConfig.timezoneLabel || 'UTC+8')
    })
  })
})

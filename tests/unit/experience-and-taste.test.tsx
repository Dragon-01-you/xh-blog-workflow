// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import fs from 'node:fs'
import path from 'node:path'
import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import {
  records,
  books,
  experience,
  brandConfig,
  type Record_,
  type Book,
} from '~/lib/personal'
import { LanguageProvider } from '~/lib/i18n'
import { ExperienceSection } from '~/components/experience'
import { VinylShelf } from '~/components/vinyl-shelf'
import { Bookshelf } from '~/components/bookshelf'

// Polyfill ResizeObserver for jsdom
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub)
  vi.stubGlobal('matchMedia', vi.fn(() => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('03: Home Experience, VinylShelf & 3D Bookshelf', () => {
  describe('1. Personal Registry Data Integrity & Physical Assets', () => {
    it('strictly uses brand name and never contains "星火"', () => {
      const recordsJson = JSON.stringify(records)
      const booksJson = JSON.stringify(books)
      const expJson = JSON.stringify(experience)

      expect(recordsJson).not.toContain('星火')
      expect(booksJson).not.toContain('星火')
      expect(expJson).not.toContain('星火')

      expect(brandConfig.name).toBeTruthy()
      expect(brandConfig.name).not.toContain('星火')
    })

    it('verifies that books have physical cover images and valid URLs', () => {
      expect(books.length).toBeGreaterThan(0)

      for (const book of books) {
        expect(book.title).toBeTruthy()
        expect(book.cover).toBeDefined()
        expect(book.cover).toMatch(/^\/images\/books\/[\w-]+\.jpg$/)

        // Verify physical file exists in public directory
        const relativePath = book.cover.replace(/^\//, '')
        const fullPath = path.join(process.cwd(), 'public', relativePath)
        expect(fs.existsSync(fullPath)).toBe(true)

        // Verify URL is present
        expect(book.url).toBeDefined()

        // Verify reading commentary is present
        expect(book.comment).toBeDefined()
        expect(book.comment.length).toBeGreaterThan(0)
      }
    })

    it('verifies that vinyl records have physical cover images, moods, and music URLs', () => {
      expect(records.length).toBeGreaterThan(0)

      for (const record of records) {
        expect(record.album).toBeTruthy()
        expect(record.cover).toBeDefined()
        expect(record.cover).toMatch(/^\/images\/records\/[\w-]+\.jpg$/)

        // Verify physical file exists in public directory
        const relativePath = record.cover.replace(/^\//, '')
        const fullPath = path.join(process.cwd(), 'public', relativePath)
        expect(fs.existsSync(fullPath)).toBe(true)

        // Verify URL is present
        expect(record.url).toBeDefined()

        // Verify mood and commentary
        expect(record.mood).toBeDefined()
        expect(record.comment).toBeDefined()
        expect(record.comment.length).toBeGreaterThan(0)
      }
    })
  })

  describe('2. ExperienceSection (01 // 经历 & 坐标卡)', () => {
    let container: HTMLDivElement
    let root: Root

    beforeEach(() => {
      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)
    })

    afterEach(() => {
      act(() => {
        root.unmount()
      })
      container.remove()
    })

    it('renders section title "01 // 经历", career timeline, and coordinate card', () => {
      act(() => {
        root.render(
          <LanguageProvider defaultLanguage="zh">
            <ExperienceSection />
          </LanguageProvider>
        )
      })

      // Section tag check
      expect(container.textContent).toContain('01 //')
      expect(container.textContent).toContain('经历')

      // Career timeline checks
      if (experience.length > 0) {
        expect(container.textContent).toContain(experience[0].company)
        expect(container.textContent).toContain(experience[0].role)
      }

      // Coordinate card checks
      expect(container.textContent).toContain(brandConfig.locationCoordinates.lat)
      expect(container.textContent).toContain(brandConfig.locationCoordinates.lng)
      expect(container.textContent).toContain(brandConfig.location.split(',')[0].trim())
    })
  })

  describe('3. VinylShelf (03 // 循环播放中 3D 旋转黑胶唱片架)', () => {
    let container: HTMLDivElement
    let root: Root

    beforeEach(() => {
      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)
    })

    afterEach(() => {
      act(() => {
        root.unmount()
      })
      container.remove()
    })

    it('renders vinyl records with sliding/rotating disc, mood annotation, and smooth navigation', () => {
      act(() => {
        root.render(
          <LanguageProvider defaultLanguage="zh">
            <VinylShelf />
          </LanguageProvider>
        )
      })

      const triggers = container.querySelectorAll<HTMLButtonElement>('.vinyl-trigger')
      expect(triggers.length).toBe(records.length)

      // Initial active record (middle one)
      const initialIndex = Math.floor(records.length / 2)
      const initialRecord = records[initialIndex]
      expect(triggers[initialIndex].getAttribute('aria-pressed')).toBe('true')

      // Check rotating vinyl disc element exists
      const disc = container.querySelector('.vinyl-disc')
      expect(disc).not.toBeNull()

      // Check annotation card contains album, artist, mood, and comment
      const annotation = container.querySelector('.vinyl-annotation')
      expect(annotation).not.toBeNull()
      expect(annotation?.textContent).toContain(initialRecord.album)
      expect(annotation?.textContent).toContain(initialRecord.mood)
      expect(annotation?.textContent).toContain(initialRecord.comment)

      // Check external link
      const link = annotation?.querySelector('a')
      expect(link?.getAttribute('href')).toBe(initialRecord.url)

      // ArrowRight keyboard navigation
      act(() => {
        triggers[initialIndex].dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
        )
      })

      const nextIndex = (initialIndex + 1) % records.length
      const nextRecord = records[nextIndex]
      expect(triggers[nextIndex].getAttribute('aria-pressed')).toBe('true')
      expect(container.querySelector('.vinyl-annotation')?.textContent).toContain(nextRecord.album)
      expect(container.querySelector('.vinyl-annotation')?.textContent).toContain(nextRecord.mood)
    })


  })

  describe('4. Bookshelf (04 // 珍藏书架 3D 抽书立体书架)', () => {
    let container: HTMLDivElement
    let root: Root

    beforeEach(() => {
      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)
    })

    afterEach(() => {
      act(() => {
        root.unmount()
      })
      container.remove()
    })

    it('renders books with 3D spines, draws out selected book with cover and reading comment', () => {
      act(() => {
        root.render(
          <LanguageProvider defaultLanguage="zh">
            <Bookshelf />
          </LanguageProvider>
        )
      })

      const bookButtons = container.querySelectorAll<HTMLButtonElement>('.book3')
      expect(bookButtons.length).toBe(books.length)

      // Initially, book 0 is open
      expect(bookButtons[0].getAttribute('aria-pressed')).toBe('true')
      const annotation = container.querySelector('.shelf-annotation')
      expect(annotation).not.toBeNull()
      expect(annotation?.textContent).toContain(books[0].title)
      expect(annotation?.textContent).toContain(books[0].comment)

      // External link matches book.url
      const link = annotation?.querySelector('a') ?? annotation
      expect(link?.getAttribute('href')).toBe(books[0].url)

      // Click on book 1 if multiple books exist
      if (books.length > 1) {
        act(() => {
          bookButtons[1].click()
        })

        expect(bookButtons[1].getAttribute('aria-pressed')).toBe('true')
        expect(bookButtons[0].getAttribute('aria-pressed')).toBe('false')
        expect(container.querySelector('.shelf-annotation')?.textContent).toContain(books[1].title)
        expect(container.querySelector('.shelf-annotation')?.textContent).toContain(books[1].comment)
      }
    })
  })
})

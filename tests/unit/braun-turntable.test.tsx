// @vitest-environment jsdom
// @ts-expect-error React 19 act environment flag
globalThis.IS_REACT_ACT_ENVIRONMENT = true

import React, { act } from 'react'
import { createRoot, Root } from 'react-dom/client'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'

import { records } from '~/lib/personal'
import { LanguageProvider } from '~/lib/i18n'
import { BraunVinylTurntable } from '~/components/braun-vinyl-turntable'

beforeEach(() => {
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

describe('Braun Hi-Fi Minimalist Turntable Component', () => {
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

  it('renders Braun Audio 310 chassis with tonearm, strobe dots, and RPM controls', () => {
    act(() => {
      root.render(
        <LanguageProvider defaultLanguage="zh">
          <BraunVinylTurntable record={records[0]} />
        </LanguageProvider>
      )
    })

    const turntable = container.querySelector('.braun-turntable-chassis')
    expect(turntable).not.toBeNull()
    expect(turntable?.textContent).toContain('BRAUN AUDIO 310')
    expect(turntable?.textContent).toContain('TONEARM MECHANISM')
    expect(turntable?.textContent).toContain('33 ⅓')
    expect(turntable?.textContent).toContain('45')
  })
})

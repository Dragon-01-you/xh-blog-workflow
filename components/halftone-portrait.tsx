'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
import clsx from 'clsx'
import { useLanguage, localize } from '~/lib/i18n'

const MOBILE_CELL = 2
const DESKTOP_CELL = 3
const MOBILE_PRESENTATION_MAX = 200
const EDGE_FADE = 0.1
const RADIUS = 150
const SWELL = 0.08
const PUSH = 3
const FADE_MS = 550

const INK_LIGHT = 'oklch(0.145 0 0)'
const INK_DARK = 'oklch(0.985 0 0)'

interface Cell {
  x: number
  y: number
  tone: number
}

interface Field {
  cells: Cell[]
  cell: number
  ink: string
}

export interface HalftonePortraitProps {
  srcLight: string
  srcDark: string
  alt: string
  altEn: string
  className?: string
  onToggleStage?: () => void
  onClick?: () => void
}

/**
 * HalftonePortrait: High-definition halftone dot portrait with day/night dual sources.
 * - Light mode: black ink dots on white ground (sourced from srcLight)
 * - Dark mode: pure dark ground, white ink dots with natural taper (sourced from srcDark)
 * - Mouse hover generates elastic repulsive force and dot swelling.
 * - Interactive Click Reveal: Clicking smoothly dissolves the halftone dots,
 *   revealing the 100% true-color original photograph (/images/headshot.jpg in light mode,
 *   /images/portrait-square.jpg in dark mode). Clicking again restores the halftone print.
 * - Reduced motion falls back to static print and instant photo swap.
 */
export function HalftonePortrait({
  srcLight,
  srcDark,
  alt,
  altEn,
  className,
  onToggleStage,
  onClick,
}: HalftonePortraitProps): React.JSX.Element {
  const { language } = useLanguage()
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [revealed, setRevealed] = useState(false)

  const handleToggle = useCallback(
    (e?: React.MouseEvent | React.KeyboardEvent) => {
      setRevealed((prev) => !prev)
      onToggleStage?.()
      onClick?.()
    },
    [onToggleStage, onClick]
  )

  useEffect(() => {
    const wrapperEl = wrapperRef.current
    const canvasEl = canvasRef.current
    if (!wrapperEl || !canvasEl) return

    const wrapper: HTMLElement = wrapperEl
    const canvas: HTMLCanvasElement = canvasEl
    let maybeCtx: CanvasRenderingContext2D | null = null
    try {
      maybeCtx = canvas.getContext('2d')
    } catch {
      return
    }
    if (!maybeCtx) return
    const ctx: CanvasRenderingContext2D = maybeCtx

    let cssW = 0
    let cssH = 0
    let raf = 0
    const fields: { light?: Field; dark?: Field } = {}
    let fade: { from: 'light' | 'dark'; to: 'light' | 'dark'; start: number } | null = null
    const pointer = { x: -1e4, y: -1e4 }
    const target = { x: -1e4, y: -1e4 }
    let pointerActive = false

    const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    const interactive =
      hasMatchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const reduced =
      hasMatchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const isDark = () =>
      typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

    const images: Partial<Record<'light' | 'dark', HTMLImageElement>> = {}

    function loadImage(kind: 'light' | 'dark', src: string) {
      if (typeof Image === 'undefined') return
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      const done = () => {
        images[kind] = img
        buildField(kind)
        draw()
      }
      if (img.complete && img.naturalWidth > 0) {
        done()
      } else {
        img.addEventListener('load', done, { once: true })
      }
    }

    function buildField(kind: 'light' | 'dark') {
      const img = images[kind]
      if (!img || cssW < 4) return
      const cell =
        kind === 'light' && cssW < MOBILE_PRESENTATION_MAX ? MOBILE_CELL : DESKTOP_CELL
      const cols = Math.max(1, Math.round(cssW / cell))
      const rows = Math.max(1, Math.round(cssH / cell))
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return
      const scale = Math.max(cols / (img.naturalWidth || 1), rows / (img.naturalHeight || 1))
      const dw = (img.naturalWidth || 1) * scale
      const dh = (img.naturalHeight || 1) * scale
      octx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh)

      let data: Uint8ClampedArray
      try {
        data = octx.getImageData(0, 0, cols, rows).data
      } catch {
        return
      }

      const lums = new Float32Array(cols * rows)
      for (let i = 0; i < lums.length; i++) {
        const j = i * 4
        lums[i] = (0.2126 * data[j] + 0.7152 * data[j + 1] + 0.0722 * data[j + 2]) / 255
      }
      const sorted = Float32Array.from(lums).sort()
      const lo = sorted[Math.floor(sorted.length * 0.05)]
      const hi = sorted[Math.floor(sorted.length * 0.95)]
      const range = Math.max(0.05, hi - lo)

      const cells: Cell[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lum = Math.min(1, Math.max(0, (lums[r * cols + c] - lo) / range))
          const tone = kind === 'light' ? (lum > 0.93 ? 0 : Math.pow(1 - lum, 0.95)) : lum
          if (tone < 0.06) continue

          const u = (c + 0.5) / cols
          const v = (r + 0.5) / rows
          const edgeDist = Math.min(u, 1 - u, v, 1 - v)
          const edgeAlpha = edgeDist < EDGE_FADE ? Math.sin((edgeDist / EDGE_FADE) * (Math.PI / 2)) : 1

          cells.push({
            x: (c + 0.5) * cell,
            y: (r + 0.5) * cell,
            tone: tone * edgeAlpha,
          })
        }
      }

      fields[kind] = {
        cells,
        cell,
        ink: kind === 'light' ? INK_LIGHT : INK_DARK,
      }
    }

    function drawField(field: Field, alpha: number) {
      if (alpha <= 0.01) return false
      ctx.globalAlpha = alpha
      ctx.fillStyle = field.ink
      const maxR = field.cell * 0.52
      let painted = false
      for (const cell of field.cells) {
        let { x, y } = cell
        let r = cell.tone * maxR
        if (pointerActive || pointer.x > -1e3) {
          const dx = x - pointer.x
          const dy = y - pointer.y
          const d = Math.hypot(dx, dy)
          if (d < RADIUS) {
            const t = 1 - d / RADIUS
            const fall = t * t * (3 - 2 * t)
            r *= 1 + SWELL * fall
            const push = (PUSH * fall) / (d || 1)
            x += dx * push
            y += dy * push
          }
        }
        if (r < 0.3) continue
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
        painted = true
      }
      ctx.globalAlpha = 1
      return painted
    }

    function draw() {
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, cssW, cssH)
      const active: 'light' | 'dark' = isDark() ? 'dark' : 'light'
      let painted = false
      if (fade) {
        const t = Math.min(1, (performance.now() - fade.start) / FADE_MS)
        const ease = t * t * (3 - 2 * t)
        const fromField = fields[fade.from]
        const toField = fields[fade.to]
        if (fromField) {
          painted = drawField(fromField, 1 - ease) || painted
        }
        if (toField) {
          painted = drawField(toField, ease) || painted
        }
        if (t >= 1) fade = null
      } else {
        const field = fields[active]
        if (field) {
          painted = drawField(field, 1)
        }
      }
      if (painted && !wrapper.hasAttribute('data-ready')) {
        wrapper.dataset.ready = ''
      }
    }

    function tick() {
      raf = 0
      const dx = target.x - pointer.x
      const dy = target.y - pointer.y
      pointer.x += dx * 0.16
      pointer.y += dy * 0.16
      draw()
      if (pointerActive || fade || Math.hypot(dx, dy) > 0.5) {
        raf = requestAnimationFrame(tick)
      }
    }

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    function layout() {
      const rect = wrapper.getBoundingClientRect()
      cssW = rect.width || 176
      cssH = rect.height || 176
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      buildField('light')
      buildField('dark')
      draw()
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target.x = e.clientX - rect.left
      target.y = e.clientY - rect.top
      pointerActive = true
      wake()
    }

    const onLeave = () => {
      pointerActive = false
      target.x = -1e4
      target.y = -1e4
      wake()
    }

    if (interactive) {
      canvas.addEventListener('pointermove', onMove)
      canvas.addEventListener('pointerleave', onLeave)
    }

    loadImage('light', srcLight)
    loadImage('dark', srcDark)

    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => layout())
      ro.observe(canvas)
    } else {
      layout()
    }

    let mo: MutationObserver | null = null
    if (typeof MutationObserver !== 'undefined') {
      let lastDark = isDark()
      mo = new MutationObserver(() => {
        const nowDark = isDark()
        if (nowDark === lastDark) return
        lastDark = nowDark
        if (reduced) {
          draw()
          return
        }
        fade = {
          from: nowDark ? 'light' : 'dark',
          to: nowDark ? 'dark' : 'light',
          start: performance.now(),
        }
        wake()
      })
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    }

    return () => {
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      ro?.disconnect()
      mo?.disconnect()
      if (raf) cancelAnimationFrame(raf)
    }
  }, [srcLight, srcDark])

  const localizedAlt = localize(language, alt, altEn)

  return (
    <span
      ref={wrapperRef}
      className={`relative block aspect-square overflow-hidden cursor-pointer select-none rounded-2xl ${className || ''}`}
      data-halftone
      data-revealed={revealed ? 'true' : 'false'}
      onClick={handleToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleToggle(e)
        }
      }}
    >
      {/* Warm both source images from the server HTML without exposing raw photo frame */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcLight}
        alt=""
        width={1000}
        height={1000}
        crossOrigin="anonymous"
        hidden
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={srcDark}
        alt=""
        width={1000}
        height={1000}
        crossOrigin="anonymous"
        hidden
        aria-hidden
      />

      {/* Real Full-Color Photographic Reveal Layer (dissolves in upon click) */}
      <span
        data-real-photo
        className={clsx(
          'portrait-photo-reveal absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 ease-out z-10 overflow-hidden rounded-2xl',
          revealed ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'
        )}
        aria-hidden="true"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={srcLight}
          alt=""
          className="dark:hidden w-full h-full object-cover"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={srcDark}
          alt=""
          className="hidden dark:block w-full h-full object-cover"
        />
      </span>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={localizedAlt}
        className={clsx(
          'halftone-canvas absolute inset-0 w-full h-full block transition-opacity duration-500 ease-out',
          revealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        )}
      />
    </span>
  )
}

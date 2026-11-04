'use client'

import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { localize, useLocale } from '~/lib/locale-client'

const VIEWPORT_PAD = 32
const DEFAULT_ROOT_FONT_SIZE = 16
const DETAIL_SPACE_REM = 4.5
const MOBILE_DETAIL_SPACE_REM = 7
const MOBILE_BREAKPOINT_REM = 40

type CloseReason = 'escape' | 'overlay' | 'viewport'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

function rootFontSizePixels(): number {
  if (typeof window === 'undefined') return DEFAULT_ROOT_FONT_SIZE
  const rootFontSize = Number.parseFloat(
    window.getComputedStyle(document.documentElement).fontSize,
  )
  return Number.isFinite(rootFontSize) ? rootFontSize : DEFAULT_ROOT_FONT_SIZE
}

export interface ZoomImageProps {
  src: string
  alt: string
  width: number
  height: number
  sizes?: string
  className?: string
  style?: React.CSSProperties
  expandedContent?: React.ReactNode
}

export function ZoomImage({
  src,
  alt,
  width,
  height,
  sizes,
  className,
  style,
  expandedContent,
}: ZoomImageProps): React.JSX.Element {
  const locale = useLocale()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const preloadedSrcRef = useRef<string | null>(null)
  const [zoom, setZoom] = useState<{
    expandedSrc: string
    target: { left: number; top: number; width: number; height: number }
    from: string
    motion: 'animated' | 'instant'
  } | null>(null)
  const [state, setState] = useState<'opening' | 'open' | 'closing'>('opening')
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const expandedSrc = src

  const preloadExpanded = useCallback(() => {
    if (typeof window === 'undefined') return
    if (preloadedSrcRef.current === expandedSrc) return
    const preload = document.createElement('img')
    preload.decoding = 'async'
    preload.src = expandedSrc
    preloadedSrcRef.current = expandedSrc
  }, [expandedSrc])

  const open = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const img = triggerRef.current?.querySelector('img')
      if (!img) return
      const rect = img.getBoundingClientRect()

      const maxW = Math.min(window.innerWidth - VIEWPORT_PAD * 2, width)
      const rootFontSize = rootFontSizePixels()
      const detailSpace = expandedContent
        ? (window.innerWidth < MOBILE_BREAKPOINT_REM * rootFontSize
            ? MOBILE_DETAIL_SPACE_REM
            : DETAIL_SPACE_REM) * rootFontSize
        : 0
      const maxH = Math.max(
        1,
        Math.min(window.innerHeight - VIEWPORT_PAD * 2 - detailSpace, height),
      )
      const scale = Math.min(maxW / width, maxH / height)
      const w = Math.round(width * scale)
      const h = Math.round(height * scale)
      const target = {
        left: Math.round((window.innerWidth - w) / 2),
        top: Math.round((window.innerHeight - detailSpace - h) / 2),
        width: w,
        height: h,
      }

      const s = rect.width / (w || 1)
      const tx = rect.left + rect.width / 2 - (target.left + w / 2)
      const ty = rect.top + rect.height / 2 - (target.top + h / 2)
      const reduced = prefersReducedMotion()
      const instant = event.detail === 0 || reduced
      setZoom({
        expandedSrc,
        target,
        from: `translate(${tx}px, ${ty}px) scale(${s})`,
        motion: instant ? 'instant' : 'animated',
      })
      setState(instant ? 'open' : 'opening')
    },
    [expandedSrc, width, height, expandedContent],
  )

  const unmount = useCallback(() => {
    setZoom(null)
    setState('opening')
    triggerRef.current?.focus({ preventScroll: true })
  }, [])

  const close = useCallback(
    (reason: CloseReason) => {
      const reduced = prefersReducedMotion()
      if (
        reason === 'escape' ||
        reduced ||
        zoom?.motion === 'instant' ||
        stateRef.current === 'opening'
      ) {
        unmount()
        return
      }
      if (stateRef.current !== 'open') return

      const img = triggerRef.current?.querySelector('img')
      if (img) {
        const rect = img.getBoundingClientRect()
        setZoom((prev) => {
          if (!prev) return prev
          const s = rect.width / (prev.target.width || 1)
          const tx =
            rect.left + rect.width / 2 - (prev.target.left + prev.target.width / 2)
          const ty =
            rect.top + rect.height / 2 - (prev.target.top + prev.target.height / 2)
          return { ...prev, from: `translate(${tx}px, ${ty}px) scale(${s})` }
        })
      }
      setState('closing')
    },
    [unmount, zoom?.motion],
  )

  useEffect(() => {
    if (!zoom || state !== 'opening') return
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setState('open')),
    )
    return () => cancelAnimationFrame(raf)
  }, [zoom, state])

  useEffect(() => {
    if (zoom && state === 'open') {
      overlayRef.current?.focus({ preventScroll: true })
    }
    if (state !== 'closing') return
    const t = setTimeout(unmount, 450)
    return () => clearTimeout(t)
  }, [zoom, state, unmount])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close('escape')
      }
      if (e.key === 'Tab') e.preventDefault()
    }
    const onGesture = (e: Event) => {
      e.preventDefault()
      close('viewport')
    }
    const scrollPosition = { x: window.scrollX, y: window.scrollY }
    const onScroll = () => {
      if (
        window.scrollX === scrollPosition.x &&
        window.scrollY === scrollPosition.y
      ) {
        return
      }
      close('viewport')
    }
    const onResize = () => close('viewport')
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onGesture, { passive: false })
    window.addEventListener('touchmove', onGesture, { passive: false })
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onGesture)
      window.removeEventListener('touchmove', onGesture)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [zoom, close])

  const settle = () => {
    if (stateRef.current === 'closing') unmount()
  }

  const floating = state === 'open'

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="zoom-trigger cursor-zoom-in block w-full text-left"
        style={style}
        aria-label={
          alt
            ? localize(locale, `放大图片：${alt}`, `Zoom image: ${alt}`)
            : localize(locale, '放大图片', 'Zoom image')
        }
        data-zoomed={zoom ? '' : undefined}
        onPointerEnter={preloadExpanded}
        onFocus={preloadExpanded}
        onClick={open}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={className}
        />
      </button>
      {zoom &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={overlayRef}
            tabIndex={-1}
            className="zoom-overlay"
            data-state={floating ? 'open' : state}
            data-motion={zoom.motion}
            role="dialog"
            aria-modal="true"
            aria-label={alt || localize(locale, '图片', 'Image')}
            onClick={() => close('overlay')}
          >
            <div className="zoom-overlay-backdrop" />
            <Image
              unoptimized
              src={zoom.expandedSrc}
              alt={alt}
              width={width}
              height={height}
              loading="eager"
              fetchPriority="high"
              style={{
                left: zoom.target.left,
                top: zoom.target.top,
                width: zoom.target.width,
                height: zoom.target.height,
                transform: floating ? 'none' : zoom.from,
              }}
              onTransitionEnd={settle}
            />
            <div
              aria-hidden
              className="zoom-overlay-marks calibration-corners"
              style={
                {
                  left: zoom.target.left - 10,
                  top: zoom.target.top - 10,
                  width: zoom.target.width + 20,
                  height: zoom.target.height + 20,
                  '--corner-arm': '11px',
                } as React.CSSProperties
              }
            />
            {expandedContent && (
              <div className="zoom-overlay-details">{expandedContent}</div>
            )}
          </div>,
          document.body,
        )}
    </>
  )
}

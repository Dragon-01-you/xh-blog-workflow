'use client'

import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import { ExternalLabel } from './external-mark'
import { localize, useLocale } from '~/lib/locale-client'
import { records, type Record_ } from '~/lib/personal'
import { T } from '~/lib/i18n'

const hitCorners = ['top-left', 'top-right', 'bottom-right', 'bottom-left'] as const
const dragIntentThreshold = 7
const dragClickSuppressionDelay = 500
const wheelSettleDelay = 140
const settleFallbackDelay = 480

type Point = { x: number; y: number }
type InteractionPhase = 'idle' | 'instant' | 'panning' | 'settling'
type PointerIntent = 'pending' | 'horizontal' | 'vertical'

export interface SleeveFinish {
  creaseStyle: React.CSSProperties
  paperSize: number
  paperX: number
  paperY: number
  restOffset: number
  restTilt: number
  wearOpacity: number
  wearX: number
  wearY: number
}

interface PointerSession {
  pointerId: number
  startX: number
  startY: number
  startPosition: number
  selectionStep: number
  intent: PointerIntent
  focusWasInside: boolean
}

interface SleeveMotion {
  contactOpacity: number
  contactScale: number
  direction: number
  forward: number
  inwardAngle: number
  offset: number
  originX: string
  restOffset: number
  restTilt: number
  scale: number
  stackOrder: number
}

function hashOf(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function sleeveFinish(seed: string): SleeveFinish {
  const h = hashOf(seed) >>> 0
  const creaseCount = (h >>> 3) % 3
  const creaseImages: string[] = []
  const creasePositions: string[] = []
  const creaseSizes: string[] = []

  for (let index = 0; index < creaseCount; index++) {
    const creaseSeed = hashOf(`${seed}:${index}`) >>> 0
    const xSeed = hashOf(`horizontal:${index}:${seed}`) >>> 0
    const ySeed = hashOf(`${seed}:vertical:${index}`) >>> 0
    const angle = 22 + (creaseSeed % 137)
    const width = 34 + ((creaseSeed >>> 5) % 31)
    const height = 22 + ((creaseSeed >>> 11) % 23)
    const x = 6 + (xSeed % 85)
    const y = 6 + (ySeed % 85)

    creaseImages.push(
      `linear-gradient(${angle}deg, transparent 47%, rgb(0 0 0 / 0.08) 49%, rgb(255 255 255 / 0.14) 50%, transparent 52%)`,
    )
    creaseSizes.push(`${width}% ${height}%`)
    creasePositions.push(`${x}% ${y}%`)
  }

  return {
    creaseStyle: {
      '--vinyl-crease-image': creaseImages.length > 0 ? creaseImages.join(', ') : 'none',
      '--vinyl-crease-position': creasePositions.length > 0 ? creasePositions.join(', ') : '0 0',
      '--vinyl-crease-size': creaseSizes.length > 0 ? creaseSizes.join(', ') : '0 0',
    } as React.CSSProperties,
    paperSize: 84 + ((h >>> 20) % 3) * 12,
    paperX: (h >>> 8) % 108,
    paperY: (h >>> 16) % 192,
    restOffset: ((h >>> 5) % 3) * 0.55,
    restTilt: ((h % 9) - 4) * 0.085,
    wearOpacity: 0.13 + ((h >>> 10) % 5) * 0.01,
    wearX: (h & 1) === 0 ? 8 : 92,
    wearY: (h & 2) === 0 ? 10 : 90,
  }
}

const sleeveFinishes = records.map((record) =>
  sleeveFinish(`${record.artist}, ${record.album} (${record.year})`),
)

function sleeveMotion(index: number, selectionPosition: number): SleeveMotion {
  const offset = index - selectionPosition
  const distance = Math.abs(offset)
  const activeAmount = Math.max(0, 1 - distance)
  const restingAmount = Math.min(distance, 1)
  const inwardAngle = Math.min(68, 16 * Math.min(distance, 1) + distance * 13)
  const contactScale = Math.max(0.38, Math.cos((inwardAngle * Math.PI) / 180))
  const finish = sleeveFinishes[index]

  return {
    contactOpacity: Math.max(0.16, 0.34 - distance * 0.035),
    contactScale: Number((contactScale * (0.96 + activeAmount * 0.04)).toFixed(4)),
    direction: Math.sign(offset),
    forward: activeAmount * 4,
    inwardAngle,
    offset,
    originX: `${50 - Math.max(-1, Math.min(1, offset)) * 50}%`,
    restOffset: finish.restOffset * restingAmount,
    restTilt: finish.restTilt * restingAmount,
    scale: Math.max(0.92, 1 - distance * 0.012 + activeAmount * 0.04),
    stackOrder: Math.max(
      1,
      Math.round((records.length - distance) * 100) +
        (index === Math.round(selectionPosition) ? 1 : 0),
    ),
  }
}

function sleeveMotionStyle(motion: SleeveMotion): React.CSSProperties {
  return {
    '--vinyl-offset': motion.offset,
    '--vinyl-direction': motion.direction,
    '--vinyl-contact-opacity': motion.contactOpacity,
    '--vinyl-contact-scale': motion.contactScale,
    '--vinyl-forward': motion.forward,
    '--vinyl-inward-angle': motion.inwardAngle,
    '--vinyl-rest-offset': motion.restOffset,
    '--vinyl-rest-tilt': motion.restTilt,
    '--vinyl-scale': motion.scale,
    '--vinyl-origin-x': motion.originX,
  } as React.CSSProperties
}

function sleeveMotionCssText(motion: SleeveMotion) {
  return [
    `--vinyl-offset:${motion.offset}`,
    `--vinyl-direction:${motion.direction}`,
    `--vinyl-contact-opacity:${motion.contactOpacity}`,
    `--vinyl-contact-scale:${motion.contactScale}`,
    `--vinyl-forward:${motion.forward}`,
    `--vinyl-inward-angle:${motion.inwardAngle}`,
    `--vinyl-rest-offset:${motion.restOffset}`,
    `--vinyl-rest-tilt:${motion.restTilt}`,
    `--vinyl-scale:${motion.scale}`,
    `--vinyl-origin-x:${motion.originX}`,
  ].join(';')
}

export function VinylShelf() {
  const locale = useLocale()
  const initialIndex = Math.floor(records.length / 2)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [selectionPosition, setSelectionPosition] = useState(initialIndex)
  const [interactionPhase, setInteractionPhaseState] = useState<InteractionPhase>('idle')
  const [pointerOwnerIndex, setPointerOwnerIndex] = useState<number | null>(null)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const shelfRef = useRef<HTMLUListElement | null>(null)
  const sleeveRefs = useRef<Array<HTMLLIElement | null>>([])
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const hitCornerRefs = useRef<Array<Array<HTMLSpanElement | null>>>([])
  const selectionPositionRef = useRef(initialIndex)
  const selectionFrameRef = useRef<number | null>(null)
  const interactionPhaseRef = useRef<InteractionPhase>('idle')
  const pointerSessionRef = useRef<PointerSession | null>(null)
  const lastPointerPointRef = useRef<Point | null>(null)
  const suppressClickRef = useRef(false)
  const suppressClickUntilRef = useRef(0)
  const suppressClickTimerRef = useRef<number | null>(null)
  const settleTimerRef = useRef<number | null>(null)
  const instantFrameRef = useRef<number | null>(null)
  const wheelTimerRef = useRef<number | null>(null)
  const wheelFocusWasInsideRef = useRef(false)
  const wheelSelectionStepRef = useRef(64)
  const pointerFocusWasInsideRef = useRef(false)

  const activeRecord: Record_ = records[activeIndex]

  function clampPosition(position: number) {
    return Math.min(records.length - 1, Math.max(0, position))
  }

  function updateSelection(position: number) {
    const nextPosition = clampPosition(position)

    if (selectionFrameRef.current !== null) {
      window.cancelAnimationFrame(selectionFrameRef.current)
      selectionFrameRef.current = null
    }

    selectionPositionRef.current = nextPosition
    setSelectionPosition(nextPosition)
  }

  function applySelectionPosition(position: number) {
    for (let index = 0; index < records.length; index++) {
      const sleeve = sleeveRefs.current[index]
      const trigger = triggerRefs.current[index]
      if (!sleeve || !trigger) continue

      const motion = sleeveMotion(index, position)
      trigger.style.cssText = sleeveMotionCssText(motion)
      sleeve.style.setProperty('--vinyl-stack-order', String(motion.stackOrder))
    }
  }

  function queueSelectionUpdate(position: number) {
    selectionPositionRef.current = clampPosition(position)
    if (selectionFrameRef.current !== null) return

    selectionFrameRef.current = window.requestAnimationFrame(() => {
      selectionFrameRef.current = null
      applySelectionPosition(selectionPositionRef.current)
    })
  }

  function setInteractionPhase(phase: InteractionPhase) {
    interactionPhaseRef.current = phase
    setInteractionPhaseState(phase)
  }

  function clearSettleTimer() {
    if (settleTimerRef.current === null) return
    window.clearTimeout(settleTimerRef.current)
    settleTimerRef.current = null
  }

  function clearInstantFrame() {
    if (instantFrameRef.current === null) return
    window.cancelAnimationFrame(instantFrameRef.current)
    instantFrameRef.current = null
  }

  function pointIsInsideSleeve(point: Point, corners: Point[]) {
    let direction = 0

    for (let index = 0; index < corners.length; index++) {
      const start = corners[index]
      const end = corners[(index + 1) % corners.length]
      const cross = (end.x - start.x) * (point.y - start.y) - (end.y - start.y) * (point.x - start.x)

      if (Math.abs(cross) < 0.01) continue

      const edgeDirection = Math.sign(cross)
      if (direction !== 0 && edgeDirection !== direction) return false
      direction = edgeDirection
    }

    return true
  }

  function resolvePointerOwner(point: Point) {
    const selectedIndex = Math.round(selectionPositionRef.current)

    const paintOrder = records
      .map((_, index) => index)
      .sort((left, right) => {
        if (left === selectedIndex) return -1
        if (right === selectedIndex) return 1

        const distanceDifference = Math.abs(left - selectedIndex) - Math.abs(right - selectedIndex)
        return distanceDifference || right - left
      })

    for (const index of paintOrder) {
      const corners = hitCornerRefs.current[index]
      if (!corners || corners.some((corner) => !corner)) continue

      const renderedCorners = corners.map((corner) => {
        const rect = corner!.getBoundingClientRect()
        return { x: rect.left, y: rect.top }
      })

      if (pointIsInsideSleeve(point, renderedCorners)) return index
    }

    return null
  }

  function restoreIdleHitOwner() {
    setInteractionPhase('idle')
    const point = lastPointerPointRef.current
    setPointerOwnerIndex(point ? resolvePointerOwner(point) : null)
  }

  function snapTo(index: number, mode: 'animated' | 'instant', shouldFocus: boolean) {
    const nextIndex = Math.min(records.length - 1, Math.max(0, index))
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    const isAlreadySnapped = Math.abs(selectionPositionRef.current - nextIndex) < 0.001

    if (interactionPhaseRef.current === 'panning') {
      flushSync(() => setSelectionPosition(selectionPositionRef.current))
    }

    clearSettleTimer()
    clearInstantFrame()
    setActiveIndex(nextIndex)

    if (mode === 'instant' && !prefersReducedMotion) {
      setInteractionPhase('instant')
      updateSelection(nextIndex)

      instantFrameRef.current = window.requestAnimationFrame(() => {
        instantFrameRef.current = window.requestAnimationFrame(() => {
          instantFrameRef.current = null
          restoreIdleHitOwner()
        })
      })
    } else if (prefersReducedMotion || isAlreadySnapped) {
      updateSelection(nextIndex)
      restoreIdleHitOwner()
    } else {
      setInteractionPhase('settling')
      updateSelection(nextIndex)
      settleTimerRef.current = window.setTimeout(() => {
        settleTimerRef.current = null
        restoreIdleHitOwner()
      }, settleFallbackDelay)
    }

    if (shouldFocus) triggerRefs.current[nextIndex]?.focus()
  }

  function getSelectionStep() {
    const selectedIndex = Math.round(selectionPositionRef.current)
    const selectedWidth = triggerRefs.current[selectedIndex]?.offsetWidth ?? 0
    const spread = shelfRef.current
      ? window.getComputedStyle(shelfRef.current).getPropertyValue('--vinyl-spread').trim()
      : ''

    if (spread.endsWith('%')) {
      const percentage = Number.parseFloat(spread)
      if (Number.isFinite(percentage) && selectedWidth > 0)
        return (Math.max(44, selectedWidth * percentage) / 100)
    }

    if (spread.endsWith('px')) {
      const pixels = Number.parseFloat(spread)
      if (Number.isFinite(pixels)) return Math.max(44, pixels)
    }

    const viewportWidth = viewportRef.current?.clientWidth ?? 0
    return Math.max(44, viewportWidth / Math.min(records.length, 9) || 64)
  }

  function scheduleClickSuppressionReset(eventTimeStamp: number) {
    if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current)
    suppressClickUntilRef.current = eventTimeStamp + dragClickSuppressionDelay
    suppressClickTimerRef.current = window.setTimeout(() => {
      suppressClickRef.current = false
      suppressClickUntilRef.current = 0
      suppressClickTimerRef.current = null
    }, dragClickSuppressionDelay)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    let nextIndex: number | undefined

    switch (event.key) {
      case 'ArrowLeft':
        nextIndex = (activeIndex - 1 + records.length) % records.length
        break
      case 'ArrowRight':
        nextIndex = (activeIndex + 1) % records.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = records.length - 1
        break
      default:
        return
    }

    event.preventDefault()
    snapTo(nextIndex, 'instant', true)
  }

  function handleShelfPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return

    const focusWasInside = event.currentTarget.contains(document.activeElement)
    pointerFocusWasInsideRef.current = focusWasInside
    pointerSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startPosition: selectionPositionRef.current,
      selectionStep: getSelectionStep(),
      intent: 'pending',
      focusWasInside,
    }

    lastPointerPointRef.current = { x: event.clientX, y: event.clientY }

    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // ignore if pointer capture unsupported/claimed
    }

    if (event.pointerType === 'mouse' && !focusWasInside) event.preventDefault()
  }

  function handleShelfPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const point = { x: event.clientX, y: event.clientY }
    lastPointerPointRef.current = point

    const session = pointerSessionRef.current
    if (!session || session.pointerId !== event.pointerId) {
      if (event.pointerType !== 'touch' && interactionPhaseRef.current === 'idle') {
        setPointerOwnerIndex(resolvePointerOwner(point))
      }
      return
    }

    const deltaX = event.clientX - session.startX
    const deltaY = event.clientY - session.startY

    if (session.intent === 'pending') {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < dragIntentThreshold) return

      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        session.intent = 'vertical'
        return
      }

      session.intent = 'horizontal'
      suppressClickRef.current = true
      setPointerOwnerIndex(null)
      setInteractionPhase('panning')

      try {
        event.currentTarget.setPointerCapture(event.pointerId)
      } catch {
        // ignore
      }
    }

    if (session.intent !== 'horizontal') return

    event.preventDefault()
    queueSelectionUpdate(session.startPosition - deltaX / session.selectionStep)
  }

  function finishPointerInteraction(event: React.PointerEvent<HTMLDivElement>) {
    const session = pointerSessionRef.current
    if (!session || session.pointerId !== event.pointerId) return

    pointerSessionRef.current = null

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (session.intent !== 'horizontal') return

    suppressClickRef.current = true
    scheduleClickSuppressionReset(event.timeStamp)
    snapTo(Math.round(selectionPositionRef.current), 'animated', session.focusWasInside)
  }

  function handleShelfPointerLeave(event: React.PointerEvent<HTMLDivElement>) {
    const session = pointerSessionRef.current
    if (session && event.currentTarget.hasPointerCapture(session.pointerId)) return

    lastPointerPointRef.current = null
    if (session && session.intent !== 'horizontal') pointerSessionRef.current = null

    if (interactionPhaseRef.current === 'idle') setPointerOwnerIndex(null)
  }

  function handleShelfClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (
      suppressClickRef.current &&
      (suppressClickUntilRef.current === 0 || event.timeStamp <= suppressClickUntilRef.current)
    ) {
      suppressClickRef.current = false
      suppressClickUntilRef.current = 0
      event.preventDefault()
      event.stopPropagation()
      return
    }

    suppressClickRef.current = false
    suppressClickUntilRef.current = 0

    if (event.detail === 0) return

    if (interactionPhaseRef.current !== 'idle') {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    const visualIndex = resolvePointerOwner({ x: event.clientX, y: event.clientY })
    if (visualIndex === null) return

    event.preventDefault()
    event.stopPropagation()
    snapTo(visualIndex, 'animated', pointerFocusWasInsideRef.current)
  }

  function handleShelfTransitionEnd(event: React.TransitionEvent<HTMLDivElement>) {
    if (interactionPhaseRef.current !== 'settling' || event.propertyName !== 'transform') return
    if (!(event.target instanceof HTMLElement) || !event.target.matches('.vinyl-trigger')) return

    clearSettleTimer()
    restoreIdleHitOwner()
  }

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const interactionViewport = viewport

    function normalizeWheelDelta(value: number, mode: number) {
      if (mode === WheelEvent.DOM_DELTA_LINE) return value * 16
      if (mode === WheelEvent.DOM_DELTA_PAGE) return value * interactionViewport.clientWidth
      return value
    }

    function handleWheel(event: WheelEvent) {
      const deltaX = normalizeWheelDelta(event.deltaX, event.deltaMode)
      const deltaY = normalizeWheelDelta(event.deltaY, event.deltaMode)

      if (Math.abs(deltaX) <= Math.abs(deltaY) || Math.abs(deltaX) < 0.5) return

      event.preventDefault()

      if (wheelTimerRef.current === null) {
        wheelFocusWasInsideRef.current = interactionViewport.contains(document.activeElement)
        wheelSelectionStepRef.current = getSelectionStep()
      } else {
        window.clearTimeout(wheelTimerRef.current)
      }

      clearSettleTimer()
      clearInstantFrame()
      setPointerOwnerIndex(null)
      setInteractionPhase('panning')
      queueSelectionUpdate(selectionPositionRef.current + deltaX / wheelSelectionStepRef.current)

      wheelTimerRef.current = window.setTimeout(() => {
        wheelTimerRef.current = null
        snapTo(Math.round(selectionPositionRef.current), 'animated', wheelFocusWasInsideRef.current)
      }, wheelSettleDelay)
    }

    interactionViewport.addEventListener('wheel', handleWheel, { passive: false })
    return () => interactionViewport.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    return () => {
      clearSettleTimer()
      clearInstantFrame()
      if (selectionFrameRef.current !== null) window.cancelAnimationFrame(selectionFrameRef.current)
      if (wheelTimerRef.current !== null) window.clearTimeout(wheelTimerRef.current)
      if (suppressClickTimerRef.current !== null) window.clearTimeout(suppressClickTimerRef.current)
    }
  }, [])

  if (records.length === 0) return null

  return (
    <section className="mt-14 space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-[var(--muted-foreground)] tracking-wider">
          03 //
        </span>
        <h2 className="text-base font-semibold tracking-tight text-[var(--foreground)]">
          <T zh="循环播放中" en="On Rotation" />
        </h2>
        <div className="h-px flex-1 bg-[var(--border)] opacity-60" />
      </div>

      <div
        className="room-shelf vinyl-room"
        data-vinyl-interaction={interactionPhase}
        data-vinyl-pointer-owner={pointerOwnerIndex ?? undefined}
      >
        <div
          ref={viewportRef}
          className="vinyl-viewport"
          style={{ touchAction: 'pan-y' }}
          onPointerDown={handleShelfPointerDown}
          onPointerMove={handleShelfPointerMove}
          onPointerUp={finishPointerInteraction}
          onPointerCancel={finishPointerInteraction}
          onLostPointerCapture={finishPointerInteraction}
          onPointerLeave={handleShelfPointerLeave}
          onClickCapture={handleShelfClickCapture}
          onTransitionEnd={handleShelfTransitionEnd}
        >
          <ul
            ref={shelfRef}
            className="vinyl-shelf"
            aria-label={localize(locale, '喜欢的唱片', 'Favorite records')}
            data-active-index={activeIndex}
          >
            {records.map((record, index) => {
              const isActive = index === activeIndex
              const accessibleName = `${record.artist}, ${record.album} (${record.year})`
              const finish = sleeveFinishes[index]
              const motion = sleeveMotion(index, selectionPosition)
              const spineTone = hashOf(accessibleName) % 5

              return (
                <li
                  key={`${record.artist}-${record.album}`}
                  ref={(element) => {
                    sleeveRefs.current[index] = element
                  }}
                  className="vinyl"
                  data-active={isActive ? '' : undefined}
                  data-index={index}
                  style={
                    {
                      '--vinyl-paper-size': `${finish.paperSize}px`,
                      '--vinyl-paper-x': `${finish.paperX}px`,
                      '--vinyl-paper-y': `${finish.paperY}px`,
                      '--vinyl-spine-tone': spineTone,
                      '--vinyl-spine-color': record.spineColor ?? '#2b2c30',
                      '--vinyl-spine-ink': record.spineInk ?? '#f7f4ed',
                      '--vinyl-wear-opacity': finish.wearOpacity,
                      '--vinyl-wear-x': `${finish.wearX}%`,
                      '--vinyl-wear-y': `${finish.wearY}%`,
                      '--vinyl-stack-order': motion.stackOrder,
                    } as React.CSSProperties
                  }
                >
                  <button
                    ref={(element) => {
                      triggerRefs.current[index] = element
                    }}
                    style={sleeveMotionStyle(motion)}
                    type="button"
                    className="vinyl-trigger"
                    id={`vinyl-trigger-${index}`}
                    data-active={isActive ? '' : undefined}
                    data-pointer-owned={pointerOwnerIndex === index ? '' : undefined}
                    aria-label={`Select ${accessibleName}`}
                    aria-pressed={isActive}
                    aria-current={isActive ? 'true' : undefined}
                    aria-posinset={index + 1}
                    aria-setsize={records.length}
                    tabIndex={isActive ? 0 : -1}
                    onKeyDown={handleKeyDown}
                    onClick={(event) => {
                      if (event.detail === 0) snapTo(index, 'instant', true)
                    }}
                  >
                    {hitCorners.map((corner, cornerIndex) => (
                      <span
                        key={corner}
                        ref={(element) => {
                          hitCornerRefs.current[index] ??= []
                          hitCornerRefs.current[index][cornerIndex] = element
                        }}
                        className="vinyl-hit-corner"
                        data-corner={corner}
                        aria-hidden
                      />
                    ))}
                    <span className="vinyl-contact-shadow" aria-hidden />

                    {/* 3D Object with sliding vinyl disc */}
                    <span className="vinyl-object">
                      {/* Rotating Vinyl Disc */}
                      <span
                        className={`vinyl-disc ${isActive ? 'vinyl-disc-active' : ''}`}
                        aria-hidden
                      >
                        <span className="vinyl-disc-grooves" />
                        <span
                          className="vinyl-disc-label"
                          style={{ backgroundColor: record.spineColor }}
                        />
                      </span>

                      {/* Vinyl Sleeve */}
                      <span className="vinyl-sleeve" aria-hidden>
                        <Image
                          src={record.cover || record.art}
                          alt={record.album}
                          width={200}
                          height={200}
                          sizes="148px"
                          className="vinyl-art"
                        />
                        <span className="vinyl-creases" style={finish.creaseStyle} />
                        <span className="vinyl-paper" />
                      </span>

                      <span className="vinyl-spine vinyl-spine-left" aria-hidden>
                        <span>{record.album} · {record.artist}</span>
                      </span>
                      <span className="vinyl-spine vinyl-spine-right" aria-hidden>
                        <span>{record.album} · {record.artist}</span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <span className="room-shelf-plank" aria-hidden />

        {/* Dynamic Vinyl Annotation Card */}
        <div className="vinyl-annotation text-center space-y-1.5 mt-3">
          <div className="inline-flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-mono rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--signal)]">
              {activeRecord.mood}
            </span>
            <a
              className="shelf-annotation text-sm font-medium text-[var(--foreground)] hover:text-[var(--signal)] transition-colors inline-flex items-center"
              href={activeRecord.url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${activeRecord.album} by ${activeRecord.artist} on NetEase Music in a new tab`}
            >
              <ExternalLabel>
                {activeRecord.album} · {activeRecord.artist}
              </ExternalLabel>
            </a>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto">
            {activeRecord.comment}
          </p>
        </div>

      </div>
    </section>
  )
}

export default VinylShelf

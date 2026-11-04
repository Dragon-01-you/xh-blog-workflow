'use client'

import React, { useEffect, useState } from 'react'

const SAG = 40 // rise at viewport edge (px)
const INSET_TOP = 18
const INSET_BOTTOM = 6
const MAJOR = { len: 5, gap: 48, opacity: 0.18 }
const MINOR = { len: 2.5, gap: 12, opacity: 0.1 }
const H = 64

function Arc({ w, edge }: { w: number; edge: 'top' | 'bottom' }) {
  const r = (w * w) / (8 * SAG)
  const apex = edge === 'top' ? INSET_TOP + MAJOR.len / 2 : H - INSET_BOTTOM - MAJOR.len / 2
  const chordY = edge === 'top' ? apex - SAG : apex + SAG
  const sweep = edge === 'top' ? 0 : 1
  const d = `M 0 ${chordY} A ${r} ${r} 0 0 ${sweep} ${w} ${chordY}`
  const offset = -(w / 2 - 0.5)
  const minorShift = ((edge === 'top' ? -1 : 1) * (MAJOR.len - MINOR.len)) / 2

  return (
    <svg width={w} height={H} className={`column-ruler-arc column-ruler-arc-${edge}`} aria-hidden="true">
      <path
        d={d}
        pathLength={w}
        fill="none"
        stroke="currentColor"
        strokeOpacity={MAJOR.opacity}
        strokeWidth={MAJOR.len}
        strokeDasharray={`1 ${MAJOR.gap - 1}`}
        strokeDashoffset={offset}
      />
      <path
        d={d}
        pathLength={w}
        fill="none"
        stroke="currentColor"
        strokeOpacity={MINOR.opacity}
        strokeWidth={MINOR.len}
        strokeDasharray={`1 ${MINOR.gap - 1}`}
        strokeDashoffset={offset}
        transform={`translate(0 ${minorShift})`}
      />
    </svg>
  )
}

export function ArcRulers() {
  const [w, setW] = useState(0)

  useEffect(() => {
    const measure = () => setW(window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  if (!w) return null

  return (
    <>
      <Arc w={w} edge="top" />
      <Arc w={w} edge="bottom" />
    </>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'

const SHADER_READY_TIMEOUT_MS = 2000

function readForegroundInk() {
  if (typeof document === 'undefined' || !document.body) return '#000000'
  return getComputedStyle(document.body).color || '#000000'
}

export function useHiddenShaderField(
  onUnavailable: () => void,
  onReady?: () => void,
) {
  const [ink, setInk] = useState(readForegroundInk)
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => {
    setReady(true)
    onReady?.()
  }, [onReady])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    const observer = new MutationObserver(() => setInk(readForegroundInk()))
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (ready || typeof window === 'undefined') return
    const timer = window.setTimeout(onUnavailable, SHADER_READY_TIMEOUT_MS)
    return () => window.clearTimeout(timer)
  }, [onUnavailable, ready])

  return { handleReady, ink, ready }
}

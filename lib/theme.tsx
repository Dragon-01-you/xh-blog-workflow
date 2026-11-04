'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: (e?: React.MouseEvent | MouseEvent) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
})

function validTheme(val: string | null): val is Theme {
  return val === 'light' || val === 'dark' || val === 'system'
}

function getStoredTheme(fallback: Theme = 'system'): Theme {
  if (typeof window === 'undefined') return fallback
  try {
    const val = localStorage.getItem('theme')
    return validTheme(val) ? val : fallback
  } catch {
    return fallback
  }
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeClasses(resolved: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const [resolved, setResolved] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const initial = getStoredTheme(defaultTheme)
    setCurrentTheme(initial)
    const resolvedInitial = resolveTheme(initial)
    setResolved(resolvedInitial)
    applyThemeClasses(resolvedInitial)
  }, [defaultTheme])

  useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => {
      const nextResolved = resolveTheme('system')
      setResolved(nextResolved)
      applyThemeClasses(nextResolved)
    }
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [theme])

  const setTheme = useCallback((nextTheme: Theme) => {
    setCurrentTheme(nextTheme)
    try {
      localStorage.setItem('theme', nextTheme)
    } catch {
      // safe fallback
    }
    const nextResolved = resolveTheme(nextTheme)
    setResolved(nextResolved)
    applyThemeClasses(nextResolved)
  }, [])

  const toggleTheme = useCallback(
    (event?: React.MouseEvent | MouseEvent) => {
      const currentResolved = resolveTheme(theme)
      const nextResolved = currentResolved === 'light' ? 'dark' : 'light'

      // Check if View Transition is supported and coordinates available
      const doc = typeof document !== 'undefined' ? (document as unknown as { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }) : null
      const isAppearanceTransition =
        doc &&
        typeof doc.startViewTransition === 'function' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
        event &&
        'clientX' in event

      if (!isAppearanceTransition) {
        setTheme(nextResolved)
        return
      }

      const x = event.clientX
      const y = event.clientY
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = doc.startViewTransition!(() => {
        setTheme(nextResolved)
      })

      transition.ready
        .then(() => {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ]
          document.documentElement.animate(
            {
              clipPath: nextResolved === 'dark' ? clipPath : [...clipPath].reverse(),
            },
            {
              duration: 450,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement:
                nextResolved === 'dark'
                  ? '::view-transition-new(root)'
                  : '::view-transition-old(root)',
            }
          )
        })
        .catch(() => {
          // If view transition animation fails, state is already updated
        })
    },
    [theme, setTheme]
  )

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: resolved,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

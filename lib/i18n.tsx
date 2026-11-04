'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (zh: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (zh) => zh,
})

export function LanguageProvider({
  children,
  defaultLanguage = 'zh',
}: {
  children: React.ReactNode
  defaultLanguage?: Language
}) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('locale') as Language | null
      if (stored === 'en' || stored === 'zh') {
        setLanguageState(stored)
        applyLocaleToDocument(stored)
      } else {
        applyLocaleToDocument(defaultLanguage)
      }
    } catch {
      applyLocaleToDocument(defaultLanguage)
    }
  }, [defaultLanguage])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('locale', lang)
    } catch {
      // safe fallback for private mode
    }
    applyLocaleToDocument(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }, [language, setLanguage])

  const t = useCallback(
    (zh: string, en: string) => (language === 'en' ? en : zh),
    [language]
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

function applyLocaleToDocument(lang: Language) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  if (lang === 'en') {
    html.dataset.locale = 'en'
    html.lang = 'en'
  } else {
    delete html.dataset.locale
    html.lang = 'zh-CN'
  }
}

export function useLanguage(): LanguageContextType {
  return useContext(LanguageContext)
}

/**
 * <T zh="..." en="..." />
 * Renders both data-zh and data-en spans so that CSS rules can toggle
 * them instantly, while also allowing React-driven conditional display.
 */
export function T({
  zh,
  en,
}: {
  zh: React.ReactNode
  en: React.ReactNode
}) {
  return (
    <>
      <span data-zh>{zh}</span>
      <span data-en>{en}</span>
    </>
  )
}

export function localize(lang: Language, zh: string, en: string): string {
  return lang === 'en' ? en : zh
}

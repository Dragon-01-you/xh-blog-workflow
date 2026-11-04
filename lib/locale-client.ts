'use client'

import { useLanguage, localize as i18nLocalize, type Language } from './i18n'

export function useLocale(): Language {
  const { language } = useLanguage()
  return language
}

export function localize(locale: Language | string, zh: string, en: string): string {
  return i18nLocalize(locale as Language, zh, en)
}

export type Locale = 'zh' | 'en'

const ENGLISH_PREFIX = '/en'

function splitPathSuffix(path: string) {
  const suffixIndex = path.search(/[?#]/)
  if (suffixIndex === -1) return { pathname: path, suffix: '' }
  return {
    pathname: path.slice(0, suffixIndex),
    suffix: path.slice(suffixIndex),
  }
}

export function localePath(locale: Locale, path: string): string {
  const { pathname, suffix } = splitPathSuffix(path)
  // For site-2, the canonical route is /blog, /blog/[slug], etc.
  return `${pathname}${suffix}`
}

export function localize(locale: Locale, zh: string, en: string): string {
  return locale === 'en' ? en : zh
}

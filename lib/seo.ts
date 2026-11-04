import { publicPageMetadata } from './public-page-metadata'

function publicSiteUrl(): URL {
  const raw =
    process.env.PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === 'production' ? 'https://xinhuo.ai' : 'http://localhost:3000')
  try {
    return new URL(raw)
  } catch {
    return new URL('https://xinhuo.ai')
  }
}

export const seo = {
  title: publicPageMetadata.home.zh.title,
  description: publicPageMetadata.home.zh.description,
  url: publicSiteUrl(),
} as const

export const seoEn = {
  title: publicPageMetadata.home.en.title,
  description: publicPageMetadata.home.en.description,
  url: seo.url,
} as const

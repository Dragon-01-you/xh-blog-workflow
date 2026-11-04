import type { MetadataRoute } from 'next'
import { brandConfig } from '~/lib/personal'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brandConfig.name} - ${brandConfig.tagline}`,
    short_name: brandConfig.name,
    description: brandConfig.bio,
    start_url: '/',
    display: 'standalone',
    background_color: '#fcfbf9',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/images/avatar.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/avatar.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

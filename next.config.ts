import type { NextConfig } from 'next'

import {
  adminSecurityHeader,
  googleOAuthFormSecurityHeader,
  securityHeaders,
} from './lib/security/headers'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/og': [
      './content/blog/**/*',
      './public/images/**/*',
    ],
    '/blog/**': ['./content/blog/**/*'],
    '/en/blog/**': ['./content/blog/**/*'],
    '/content/\\[\\.\\.\\.path\\]': ['./content/blog/**/*'],
  },

  images: {
    localPatterns: [
      { pathname: '/content/**' },
      { pathname: '/images/**' },
      { pathname: '/_next/static/**' },
    ],
  },

  headers: async () => [
    {
      source: '/:path*',
      headers: [
        ...securityHeaders,
        {
          key: 'Link',
          value: '</llms.txt>; rel="describedby"',
        },
      ],
    },
    {
      source: '/:locale(en)?/resume/:path*',
      headers: [
        { key: 'Cache-Control', value: 'private, no-store, max-age=0' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' },
        { key: 'Referrer-Policy', value: 'same-origin' },
      ],
    },
    {
      source: '/api/admin/:path*',
      headers: [{ key: 'Referrer-Policy', value: 'no-referrer' }],
    },
    {
      source: '/admin/:path*',
      headers: [adminSecurityHeader],
    },
    {
      source: '/admin/ama/settings',
      headers: [googleOAuthFormSecurityHeader],
    },
  ],
}

export default nextConfig

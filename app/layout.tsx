import type { Metadata } from 'next'
import './globals.css'

import { ThemeProvider } from '~/lib/theme'
import { LanguageProvider } from '~/lib/i18n'
import { PreviewCardTimingProvider } from '~/components/preview-card-timing'
import { AmbientBackground } from '~/components/ambient-background'
import { BottomDock } from '~/components/bottom-dock'
import { SiteFooter } from '~/components/site-footer'
import { brandConfig } from '~/lib/personal'

export const metadata: Metadata = {
  title: {
    default: `${brandConfig.name} (${brandConfig.enName})`,
    template: `%s | ${brandConfig.name}`,
  },
  description: brandConfig.tagline,
  icons: {
    icon: '/images/avatar.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className="public-site font-sans">
      <body className="antialiased min-h-screen flex flex-col selection:bg-[var(--signal)] selection:text-white">
        <ThemeProvider>
          <LanguageProvider>
            <PreviewCardTimingProvider>
              <AmbientBackground />
              <div className="flex min-h-screen flex-col pb-24">
                <main className="flex-1 pt-12 px-6 max-w-[37.5rem] w-full mx-auto">
                  {children}
                </main>
                <SiteFooter />
              </div>
              <BottomDock />
            </PreviewCardTimingProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

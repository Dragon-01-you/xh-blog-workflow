'use client'

import React from 'react'
import Link from 'next/link'
import { FooterClock } from '~/components/footer-clock'
import {
  ChannelCard,
  EmailCard,
  GitHubCard,
  type GitHubSnapshot,
  WechatCard,
  XiaohongshuCard,
} from '~/components/social-cards'
import { brailleText } from '~/lib/braille'
import { T } from '~/lib/i18n'
import { brandConfig, personalInfo } from '~/lib/personal'
import bakedGithub from '~/content/github.json'
import { channelsFor, channelPrefs } from '~/lib/channels'

function Tree({
  zh,
  en,
  children,
}: {
  zh: string
  en: string
  children: React.ReactNode
}) {
  return (
    <div className="footer-tree">
      <h2 className="footer-label">
        <T zh={zh} en={en} />
      </h2>
      <ul>{children}</ul>
    </div>
  )
}

export function SiteFooter({
  github,
}: {
  github?: GitHubSnapshot
} = {}) {
  const currentYear = channelPrefs.copyrightYear === 'inherit' ? new Date().getFullYear() : channelPrefs.copyrightYear
  const ghData = github ?? (bakedGithub as GitHubSnapshot)

  return (
    <footer className="mx-auto mt-24 w-full max-w-[37.5rem] px-6 pb-28 text-sm text-[var(--muted-foreground)] sm:pb-16">
      <div className="hairline-top grid grid-cols-2 gap-x-6 gap-y-8 pt-8 sm:grid-cols-3">
        {/* Contact Links */}
        <Tree zh="联系" en="contact">
          {channelsFor('footer').map((c) => (
            <li key={c.key}>
              <ChannelCard channel={c} trigger={<T zh={c.label} en={c.labelEn} />} />
            </li>
          ))}
        </Tree>

        {/* Navigation Index */}
        <Tree zh="索引" en="index">
          <li>
            <Link href="/" className="footer-tree-link">
              <T zh="首页" en="Home" />
            </Link>
          </li>
          <li>
            <Link href="/blog" className="footer-tree-link">
              <T zh="写作" en="Writing" />
            </Link>
          </li>
          <li>
            <Link href="/projects" className="footer-tree-link">
              <T zh="项目" en="Projects" />
            </Link>
          </li>
          <li>
            <Link href="/photos" className="footer-tree-link">
              <T zh="相册" en="Photos" />
            </Link>
          </li>
          <li>
            <a href="/feed.xml" className="footer-tree-link">
              RSS
            </a>
          </li>
        </Tree>

        {/* Colophon & Clock */}
        <div className="footer-colophon col-span-2 sm:order-first sm:col-span-1">
          <div>
            <p className="font-medium text-[var(--foreground)]">
              © {currentYear} {brandConfig.name}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {brandConfig.enName} · All rights reserved.
            </p>
            {/* Braille signature */}
            <p className="footer-braille mt-1 text-[11px] opacity-40 font-mono tracking-widest" aria-hidden="true">
              {brailleText(brandConfig.enName.toLowerCase())}
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <FooterClock />
            {/* Geo coordinates badge */}
            <div className="footer-geo" aria-hidden="true">
              <svg className="footer-geo-globe" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="9" />
                <ellipse cx="10" cy="10" rx="4" ry="9" />
                <path d="M1 10h18M1.9 6h16.2M1.9 14h16.2" />
              </svg>
              <span className="footer-geo-lines">
                <span>{brandConfig.locationCoordinates.lat}</span>
                <span>{brandConfig.locationCoordinates.lng}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

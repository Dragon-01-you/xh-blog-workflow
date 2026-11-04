'use client'

import React from 'react'
import Image from 'next/image'

import { ExternalLabel } from '~/components/external-mark'
import { SitePreviewCard } from '~/components/preview-card-timing'
import { T } from '~/lib/i18n'

export interface SocialSnapshot {
  name: string
  handle: string
  bio: string
  bioEn: string
  followers?: string
  following?: string
}

export interface GitHubSnapshot {
  user: string
  followers?: number
  total: number
  to: string
  levels: string
}

// heatmap shows recent 26 weeks (~180 days); stats show past year 150+
const WEEKS = 26
const DAYS = 7

export const GLYPHS: Record<string, { path: string; color?: string }> = {
  github: {
    path: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  wechat: {
    path: 'M8.691 2.188C4.341 2.188.804 5.07.804 8.625c0 1.93.987 3.659 2.533 4.812l-.64 2.373 2.502-1.282c.983.315 2.03.497 3.127.497.124 0 .245-.005.365-.011a6.67 6.67 0 0 1-.223-1.688c0-3.66 3.342-6.626 7.464-6.626.33 0 .653.02 1.002.055C16.143 4.966 12.756 2.188 8.691 2.188zm-2.22 3.375c.535 0 .969.434.969.969s-.434.969-.969.969-.969-.434-.969-.969.434-.969.969-.969zm4.438 0c.535 0 .969.434.969.969s-.434.969-.969.969-.969-.434-.969-.969.434-.969.969-.969zm4.72 4.156c-3.447 0-6.242 2.455-6.242 5.485 0 1.637.822 3.104 2.112 4.084l-.534 1.98 2.088-1.07c.82.264 1.693.414 2.608.414 3.447 0 6.242-2.455 6.242-5.484 0-3.03-2.795-5.485-6.242-5.485zm-1.854 2.813c.446 0 .808.362.808.808s-.362.808-.808.808-.808-.362-.808-.808.362-.808.808-.808zm3.708 0c.446 0 .808.362.808.808s-.362.808-.808.808-.808-.362-.808-.808.362-.808.808-.808z',
    color: '#07C160',
  },
}

function Glyph({ service }: { service: keyof typeof GLYPHS }) {
  const glyph = GLYPHS[service]
  if (!glyph) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden
      className="service-card-glyph"
      style={glyph.color ? { color: glyph.color } : undefined}
    >
      <path fill="currentColor" d={glyph.path} />
    </svg>
  )
}

function Card({
  trigger,
  href,
  children,
  className,
  triggerClassName = 'footer-tree-link',
}: {
  trigger: React.ReactNode
  href: string
  children: React.ReactNode
  className: string
  triggerClassName?: string
}) {
  return (
    <SitePreviewCard
      href={href}
      target="_blank"
      rel="noreferrer"
      triggerClassName={triggerClassName}
      closeDelay={120}
      popupClassName={className}
      popup={children}
      side="top"
    >
      <ExternalLabel>{trigger}</ExternalLabel>
    </SitePreviewCard>
  )
}

export function GitHubCardBody({ data }: { data: GitHubSnapshot }) {
  const levels = data.levels.slice(-WEEKS * DAYS)
  return (
    <>
      <span className="contrib-grid" aria-hidden>
        {Array.from({ length: WEEKS }, (_, w) => (
          <span key={w} className="contrib-col">
            {Array.from({ length: DAYS }, (_, d) => {
              const i = w * DAYS + d
              return (
                <i
                  key={d}
                  data-level={levels[i] ?? '0'}
                  style={{ '--ci': i } as React.CSSProperties}
                />
              )
            })}
          </span>
        ))}
      </span>
      <span className="service-card-stat">
        <span>
          <b>{data.total.toLocaleString()}</b> <T zh="次贡献" en="contributions" />
        </span>
        {data.followers != null && (
          <>
            <span aria-hidden>·</span>
            <span>
              <b>{data.followers}</b> <T zh="关注者" en="followers" />
            </span>
          </>
        )}
        <Glyph service="github" />
      </span>
    </>
  )
}

export function GitHubCard({
  data,
  trigger = 'GitHub',
  triggerClassName,
}: {
  data: GitHubSnapshot
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <Card
      trigger={trigger}
      href="https://github.com/Dragon-01-you?tab=repositories"
      className="link-card service-card"
      triggerClassName={triggerClassName}
    >
      <GitHubCardBody data={data} />
    </Card>
  )
}

export function XiaohongshuCardBody() {
  return (
    <span className="xiaohongshu-card-content">
      <span className="service-card-head">
        <Image
          src="/images/headshot.jpg"
          alt=""
          width={40}
          height={40}
          className="service-card-avatar"
        />
        <span className="service-card-names">
          <span className="service-card-name">芯火</span>
          <span className="service-card-sub">小红书号 xinhuo</span>
        </span>
        <span className="service-card-glyph xiaohongshu-card-wordmark" aria-hidden>
          <Image
            src="/images/xiaohongshu-wordmark.svg"
            alt=""
            width={48}
            height={23}
          />
        </span>
      </span>
      <span className="service-card-bio xiaohongshu-card-bio">
        <span>AI 敏捷生产力与知识沉淀系统</span>
        <span>保持独立思考 · 全栈工作流探索</span>
      </span>
      <span className="service-card-stat">
        <span>
          <b>2.3k+</b> 获赞与收藏
        </span>
        <span aria-hidden>·</span>
        <span>
          <b>120+</b> 关注者
        </span>
      </span>
    </span>
  )
}

export function XiaohongshuCard({
  trigger = '小红书',
  triggerClassName,
}: {
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <Card
      trigger={trigger}
      href="https://xhslink.cn/o/74Svva7m0kZ"
      className="link-card service-card xiaohongshu-card"
      triggerClassName={triggerClassName}
    >
      <XiaohongshuCardBody />
    </Card>
  )
}

// Email's card is the front of a mailed envelope: stamps, cancellation
// marks, sender, recipient, and folded seams.
export function EmailCard({
  address = 'you19827801947@qq.com',
  trigger = 'Email',
  triggerClassName = 'footer-tree-link',
}: {
  address?: string
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <SitePreviewCard
      href={`mailto:${address}`}
      triggerClassName={triggerClassName}
      closeDelay={120}
      popupClassName="link-card email-envelope-card"
      side="top"
      popup={
        <span className="email-envelope" aria-hidden>
          <span className="email-envelope-flap" />
          <span className="email-envelope-return">
            <span>FROM</span>
            XINHUO
            <br />
            HANGZHOU
          </span>
          <span className="email-envelope-stamps">
            <span className="email-envelope-stamp email-envelope-stamp-portrait">
              <Image src="/images/avatar.png" alt="" width={32} height={32} />
              <span>XINHUO</span>
            </span>
            <span className="email-envelope-stamp email-envelope-stamp-mark">
              <span className="email-envelope-stamp-star">✦</span>
              <span>POST · 26</span>
            </span>
          </span>
          <span className="email-envelope-postmark" />
          <span className="email-envelope-address">
            <span><T zh="收" en="TO" /></span>
            {address}
          </span>
        </span>
      }
    >
      {trigger}
    </SitePreviewCard>
  )
}

// WeChat Official Account card: shows QR code directly, strictly NO dead external links
export function WechatCardBody() {
  return (
    <span className="wechat-card-content flex flex-col items-center gap-2 p-2 text-center w-52">
      <span className="flex items-center gap-2.5 w-full justify-start border-b border-[var(--border)] pb-2">
        <Image
          src="/images/avatar.png"
          alt="来自07年的芯火"
          width={32}
          height={32}
          className="rounded-full border border-[var(--border)]"
        />
        <span className="flex flex-col text-left">
          <span className="text-xs font-semibold text-[var(--foreground)]">来自07年的芯火</span>
          <span className="text-[10px] text-[var(--muted-foreground)]">微信公众号</span>
        </span>
      </span>
      <span className="wechat-qr-wrapper relative p-1.5 bg-white rounded-lg shadow-sm border border-[var(--border)] my-0.5">
        <Image
          src="/images/wechat-qr.jpg"
          alt="来自07年的芯火 微信公众号二维码"
          width={130}
          height={130}
          className="rounded block"
        />
      </span>
      <span className="text-[10.5px] text-[var(--muted-foreground)] font-mono leading-tight">
        微信扫一扫 · 关注公众号
      </span>
    </span>
  )
}

export function WechatCard({
  trigger = '公众号',
  triggerClassName = 'footer-tree-link',
}: {
  trigger?: React.ReactNode
  triggerClassName?: string
}) {
  return (
    <SitePreviewCard
      triggerClassName={triggerClassName}
      closeDelay={120}
      popupClassName="link-card wechat-popup-card"
      side="top"
      popup={<WechatCardBody />}
    >
      {trigger}
    </SitePreviewCard>
  )
}

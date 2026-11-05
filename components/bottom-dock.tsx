'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Globe,
  X,
} from 'lucide-react'
import clsx from 'clsx'

import { T, useLanguage } from '~/lib/i18n'
import { useTheme } from '~/lib/theme'
import {
  isSoundEnabled,
  setSoundEnabled,
  playMechanicalSound,
  playDockSound,
} from '~/lib/sound'
import { brandConfig, personalInfo } from '~/lib/personal'
import { channelsFor } from '~/lib/channels'
import { ChannelGlyph } from '~/lib/channel-icons'
import { uiLabels } from '~/lib/ui-labels'

export interface DockNavItem {
  href: string
  labelZh: string
  labelEn: string
}

export const DOCK_NAV_ITEMS: readonly DockNavItem[] = [
  { href: '/', labelZh: '首页', labelEn: 'Home' },
  { href: '/blog', labelZh: '写作', labelEn: 'Writing' },
  { href: '/projects', labelZh: '项目', labelEn: 'Projects' },
  { href: '/photos', labelZh: '相册', labelEn: 'Photos' },
] as const

function DockGlass() {
  return (
    <>
      <div className="dock-glass-base" aria-hidden="true" />
      <div className="dock-glass-highlight" aria-hidden="true" />
      <div className="dock-glass-diffuse" aria-hidden="true" />
      <div className="dock-glass-rim" aria-hidden="true" />
      <div className="dock-glass-specular" aria-hidden="true" />
      <div className="dock-bezel-reflection" aria-hidden="true" />
    </>
  )
}

export function BottomDock() {
  const qrChannel = channelsFor('dock').find((c) => c.kind === 'qr-image')
  const pathname = usePathname() || '/'
  const { resolvedTheme, toggleTheme } = useTheme()
  const { toggleLanguage } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [isWeChatOpen, setIsWeChatOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSoundOn(isSoundEnabled())
  }, [])

  const handleSoundToggle = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) {
      playMechanicalSound('click')
    }
  }

  const isCurrentActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        aria-label="快捷悬浮导航"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[var(--z-dock,40)] flex items-center gap-1.5 p-1.5 rounded-full select-none"
      >
        <DockGlass />

        {/* 1. 首页 / 品牌印记 (Brand Mark & Mono Logo Slot) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>
          <Link
            href="/"
            data-brand-slot="logo-symbol"
            className={clsx(
              'dock-item p-1.5 rounded-full transition-all flex items-center justify-center relative',
              isCurrentActive('/')
                ? 'dock-item-active shadow-sm text-[var(--foreground)]'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            )}
            onClick={() => playDockSound('home')}
            aria-label={`返回${brandConfig.name}主页`}
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[var(--border)]">
              <Image
                src={brandConfig.avatar}
                alt={brandConfig.name}
                width={24}
                height={24}
                className="w-full h-full object-cover filter contrast-[1.05]"
                priority
              />
            </div>
            <span className="dock-tip" aria-hidden="true">
              <T zh="首页" en="Home" />
            </span>
          </Link>
        </motion.div>

        <span className="dock-rule" aria-hidden="true" />

        {/* 2. 核心栏目 (写作 / 项目 / 相册) */}
        {DOCK_NAV_ITEMS.filter((i) => i.href !== '/').map((item) => {
          const active = isCurrentActive(item.href)
          return (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <Link
                href={item.href}
                className={clsx(
                  'dock-item text-xs font-mono font-medium',
                  active && 'dock-item-active text-[var(--foreground)] font-semibold'
                )}
                onClick={() => playDockSound(item.href.slice(1) as 'blog' | 'projects' | 'photos')}
              >
                <span>
                  <T zh={item.labelZh} en={item.labelEn} />
                </span>
                <span className="dock-tip" aria-hidden="true">
                  <T zh={item.labelZh} en={item.labelEn} />
                </span>
              </Link>
            </motion.div>
          )
        })}

        <span className="dock-rule" aria-hidden="true" />

        {/* 3. 渠道弹窗按钮（取第一个带图样的渠道；一个都没有则整枚按钮不渲染） */}
        {qrChannel && (
          <motion.button
            type="button"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="dock-item text-xs"
            onClick={() => {
              setIsWeChatOpen((prev) => !prev)
              playMechanicalSound('click')
            }}
            aria-label={
              qrChannel.key === 'wechat'
                ? `查看${qrChannel.label || brandConfig.name}微信公众号二维码`
                : uiLabels.dockQrAria.zh.replace('{channel}', qrChannel.label)
            }
          >
            <div className="flex items-center justify-center">
              <ChannelGlyph icon={qrChannel.icon} className={clsx('w-4 h-4', qrChannel.tone)} />
            </div>
            <span className="dock-tip" aria-hidden="true">
              <T zh={qrChannel.dockLabel || qrChannel.label} en={qrChannel.dockLabelEn || qrChannel.labelEn} />
            </span>
          </motion.button>
        )}

        {/* 4. 语言切换按钮 (中 / EN) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="dock-item text-xs font-mono font-medium"
          onClick={() => {
            toggleLanguage()
            playMechanicalSound('click')
          }}
          aria-label="切换中英双语"
        >
          <div className="flex items-center justify-center">
            <Globe className="w-4 h-4 opacity-75" />
          </div>
          <span className="dock-tip" aria-hidden="true">
            <T zh="Language: English" en="语言: 中文" />
          </span>
        </motion.button>

        {/* 5. 昼夜外观切换按钮 (圆形扩散 ViewTransition) */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="dock-item"
          onClick={(e) => {
            toggleTheme(e)
            playMechanicalSound('shutter')
          }}
          aria-label="切换外观主题"
        >
          {mounted && resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-amber-300" />
          ) : (
            <Sun className="w-4 h-4 text-orange-500" />
          )}
          <span className="dock-tip" aria-hidden="true">
            <T zh="外观" en="Theme" />
          </span>
        </motion.button>

        {/* 6. 机械音效开关按钮 */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="dock-item"
          onClick={handleSoundToggle}
          aria-label="切换音效状态"
        >
          {soundOn ? (
            <Volume2 className="w-4 h-4 text-[var(--signal)]" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-50" />
          )}
          <span className="dock-tip" aria-hidden="true">
            <T zh={soundOn ? '音效: 开' : '音效: 关'} en={soundOn ? 'Sound: On' : 'Sound: Off'} />
          </span>
        </motion.button>
      </nav>

      {/* 渠道弹出模态卡片 */}
      <AnimatePresence>
        {isWeChatOpen && qrChannel && (
          <div
            className="fixed inset-0 z-[var(--z-dialog,100)] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsWeChatOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative w-full max-w-[17rem] rounded-2xl bg-[var(--card)] p-5 shadow-2xl border border-[var(--border)] text-center text-[var(--foreground)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsWeChatOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-3 text-left">
                <Image
                  src={brandConfig.avatar}
                  alt={qrChannel.label ?? brandConfig.name}
                  width={38}
                  height={38}
                  className="rounded-full border border-[var(--border)]"
                />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">{qrChannel.label ?? brandConfig.name}</h3>
                  <p className="text-[11px] text-[var(--muted-foreground)]">{qrChannel.labelEn ?? uiLabels.dockQrSubTitle.en}</p>
                </div>
              </div>

              <div className="relative p-2 bg-white rounded-xl shadow-inner border border-[var(--border)] my-2 inline-block">
                <Image
                  src={qrChannel.image || brandConfig.avatar}
                  alt={`${qrChannel.label ?? brandConfig.name} 图样`}
                  width={180}
                  height={180}
                  className="rounded-lg block"
                  priority
                />
              </div>

              <p className="mt-2 text-xs font-mono text-[var(--muted-foreground)]">
                {qrChannel.hint ?? uiLabels.dockQrSubTitle.zh}
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted-foreground)] opacity-75">
                {qrChannel.blurb ?? brandConfig.tagline}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

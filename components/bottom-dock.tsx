'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Volume2, VolumeX, Globe, X } from 'lucide-react'

import {
  WritingIcon,
  PhotosIcon,
  ProjectsIcon,
} from '~/components/dock-icons'
import { useTheme } from '~/lib/theme'
import { useLanguage, T } from '~/lib/i18n'
import {
  soundEnabled,
  setSoundEnabled,
  playMechanicalSound,
  playDockSound,
} from '~/lib/sound'
import { brandConfig, personalInfo } from '~/lib/personal'

export interface DockNavItem {
  href: string
  zh: string
  en: string
  icon?: React.ComponentType<{ className?: string }>
}

export const DOCK_NAV_ITEMS: readonly DockNavItem[] = [
  { href: '/', zh: '首页', en: 'Home' },
  { href: '/blog', zh: '写作', en: 'Writing', icon: WritingIcon },
  { href: '/projects', zh: '项目', en: 'Projects', icon: ProjectsIcon },
  { href: '/photos', zh: '相册', en: 'Photos', icon: PhotosIcon },
] as const

const DOCK_GLASS_STYLE: React.CSSProperties = {
  backdropFilter: 'blur(14px) saturate(1.3)',
  WebkitBackdropFilter: 'blur(14px) saturate(1.3)',
}

export function DockGlass() {
  return <span className="dock-glass" aria-hidden="true" style={DOCK_GLASS_STYLE} />
}

function WechatDockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M8.691 2.188C4.341 2.188.804 5.07.804 8.625c0 1.93.987 3.659 2.533 4.812l-.64 2.373 2.502-1.282c.983.315 2.03.497 3.127.497.124 0 .245-.005.365-.011a6.67 6.67 0 0 1-.223-1.688c0-3.66 3.342-6.626 7.464-6.626.33 0 .653.02 1.002.055C16.143 4.966 12.756 2.188 8.691 2.188zm-2.22 3.375c.535 0 .969.434.969.969s-.434.969-.969.969-.969-.434-.969-.969.434-.969.969-.969zm4.438 0c.535 0 .969.434.969.969s-.434.969-.969.969-.969-.434-.969-.969.434-.969.969-.969zm4.72 4.156c-3.447 0-6.242 2.455-6.242 5.485 0 1.637.822 3.104 2.112 4.084l-.534 1.98 2.088-1.07c.82.264 1.693.414 2.608.414 3.447 0 6.242-2.455 6.242-5.484 0-3.03-2.795-5.485-6.242-5.485zm-1.854 2.813c.446 0 .808.362.808.808s-.362.808-.808.808-.808-.362-.808-.808.362-.808.808-.808zm3.708 0c.446 0 .808.362.808.808s-.362.808-.808.808-.808-.362-.808-.808.362-.808.808-.808z" />
    </svg>
  )
}

export function BottomDock() {
  const pathname = usePathname() || '/'
  const { resolvedTheme, toggleTheme } = useTheme()
  const { toggleLanguage } = useLanguage()
  const [soundOn, setSoundOn] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isWeChatOpen, setIsWeChatOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    setSoundOn(soundEnabled())
  }, [])

  const handleSoundToggle = () => {
    const next = !soundOn
    setSoundOn(next)
    setSoundEnabled(next)
    if (next) {
      playMechanicalSound('click')
    }
  }

  const handleNavClick = (href: string) => {
    if (pathname !== href) {
      playDockSound()
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav
        className="dock"
        aria-label="主导航"
        style={{ viewTransitionName: 'site-dock' } as React.CSSProperties}
      >
        <DockGlass />

        {/* 1. 首页 / 芯火印记 (Brand Mark & Mono Logo Slot) */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.94 }}>
          <Link
            href="/"
            className="dock-item"
            data-active={isActive('/') || undefined}
            aria-label={`${brandConfig.name} 首页`}
            onClick={() => handleNavClick('/')}
          >
            {/* 留出槽位：支持展示极简单色符号或头像，等待用户最后给到专属 Logo 时替换 */}
            <span className="dock-avatar flex items-center justify-center overflow-hidden" data-brand-slot="logo-symbol">
              <Image
                src={brandConfig.avatar}
                alt={brandConfig.name}
                width={26}
                height={26}
                className="rounded-full object-cover"
                priority
              />
            </span>
            {isActive('/') && <span className="dock-active-dot" aria-hidden="true" />}
            <span className="dock-tip" aria-hidden="true">
              <T zh="首页" en="Home" />
            </span>
          </Link>
        </motion.div>

        <span className="dock-rule" aria-hidden="true" />

        {/* 2. 主导航条目 (写作 / 项目 / 相册) */}
        {DOCK_NAV_ITEMS.slice(1).map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <motion.div
              key={item.href}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
            >
              <Link
                href={item.href}
                className="dock-item"
                data-active={active || undefined}
                aria-label={item.zh}
                onClick={() => handleNavClick(item.href)}
              >
                {Icon && <Icon />}
                {active && <span className="dock-active-dot" aria-hidden="true" />}
                <span className="dock-tip" aria-hidden="true">
                  <T zh={item.zh} en={item.en} />
                </span>
              </Link>
            </motion.div>
          )
        })}

        <span className="dock-rule" aria-hidden="true" />

        {/* 3. 微信公众号二维码弹窗按钮 */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="dock-item text-xs"
          onClick={() => {
            setIsWeChatOpen((prev) => !prev)
            playMechanicalSound('click')
          }}
          aria-label={`查看${personalInfo.weChatOfficial || brandConfig.name}微信公众号二维码`}
        >
          <div className="flex items-center justify-center">
            <WechatDockIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="dock-tip" aria-hidden="true">
            <T zh="公众号" en="WeChat" />
          </span>
        </motion.button>

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

      {/* 微信公众号弹出模态卡片 */}
      <AnimatePresence>
        {isWeChatOpen && (
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
                  alt={personalInfo.weChatOfficial || brandConfig.name}
                  width={38}
                  height={38}
                  className="rounded-full border border-[var(--border)]"
                />
                <div>
                  <h3 className="text-sm font-semibold text-[var(--foreground)]">{personalInfo.weChatOfficial || brandConfig.name}</h3>
                  <p className="text-[11px] text-[var(--muted-foreground)]">微信公众号</p>
                </div>
              </div>

              <div className="relative p-2 bg-white rounded-xl shadow-inner border border-[var(--border)] my-2 inline-block">
                <Image
                  src={personalInfo.weChatOfficialQr || '/images/wechat-qr.jpg'}
                  alt={`${personalInfo.weChatOfficial || brandConfig.name} 微信公众号二维码`}
                  width={180}
                  height={180}
                  className="rounded-lg block"
                  priority
                />
              </div>

              <p className="mt-2 text-xs font-mono text-[var(--muted-foreground)]">
                微信扫一扫 · 关注公众号
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted-foreground)] opacity-75">
                深度长文与认知资产沉淀
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

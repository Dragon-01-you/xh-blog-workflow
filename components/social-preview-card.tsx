'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { brandConfig } from '~/lib/personal'

interface SocialPreviewCardProps {
  href: string
  label: React.ReactNode
  service: string
  handle?: string
  description?: string
  isExternal?: boolean
  children?: React.ReactNode
}

export function SocialPreviewCard({
  href,
  label,
  service,
  handle = brandConfig.enName,
  description = brandConfig.bio,
  isExternal = true,
  children,
}: SocialPreviewCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const content = (
    <span
      className="relative inline-flex items-center gap-1 group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocus={() => setIsOpen(true)}
      onBlur={() => setIsOpen(false)}
    >
      <span className="footer-tree-link inline-flex items-center gap-0.5">
        {label}
        {isExternal && (
          <ArrowUpRight
            className="w-3 h-3 opacity-40 group-hover:opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            aria-hidden="true"
          />
        )}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute bottom-full left-0 mb-2 z-[var(--z-card)] pointer-events-none w-56 rounded-xl p-3.5 shadow-xl bg-[var(--popover)] text-[var(--popover-foreground)] border border-[var(--border)]"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                {service}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                {brandConfig.name}
              </span>
            </div>
            <div className="text-xs font-medium text-[var(--foreground)] mb-1">
              @{handle}
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--muted-foreground)] line-clamp-2">
              {description}
            </p>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-tree-link"
        aria-label={`${service}: ${handle}`}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className="footer-tree-link">
      {content}
    </Link>
  )
}

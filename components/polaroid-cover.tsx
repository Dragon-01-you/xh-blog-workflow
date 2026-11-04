import Image from 'next/image'
import React from 'react'

import { DitheredImage } from '~/components/dither-veil'
import type { PostCover } from '~/lib/content'
import { tiltFromSlug } from '~/lib/polaroid'
import { cn } from '~/lib/utils'
import { postViewTransitionName } from '~/lib/view-transition-name'

export function PolaroidCover({
  slug,
  cover,
  caption,
  alt,
  tilted = false,
  priority = false,
  morph = false,
  print = false,
  sizes,
  className,
}: {
  slug: string
  cover: PostCover
  caption?: React.ReactNode
  alt?: string
  tilted?: boolean
  priority?: boolean
  morph?: boolean
  print?: boolean | 'collage'
  sizes?: string
  className?: string
}) {
  return (
    <figure
      className={cn('polaroid', tilted && 'polaroid-tilted', className)}
      style={
        {
          ...(tilted && { '--tilt': `${tiltFromSlug(slug)}deg` }),
          ...(morph && { viewTransitionName: postViewTransitionName('cover', slug) }),
        } as React.CSSProperties
      }
    >
      <span className="polaroid-photo">
        {print ? (
          <DitheredImage
            src={cover.src}
            alt={alt ?? ''}
            width={cover.width}
            height={cover.height}
            priority={priority}
            sizes={sizes}
            className="w-full"
            ditherMode={print === 'collage' ? 'collage' : 'dither'}
          />
        ) : (
          <Image
            src={cover.src}
            alt={alt ?? ''}
            width={cover.width}
            height={cover.height}
            priority={priority}
            sizes={sizes}
            className="w-full"
          />
        )}
      </span>
      <figcaption className="polaroid-caption">{caption ?? cover.caption ?? ' '}</figcaption>
    </figure>
  )
}

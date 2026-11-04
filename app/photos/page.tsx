import React, { Suspense } from 'react'
import type { Metadata } from 'next'
import { PixelCluster } from '~/components/pixel-cluster'
import {
  PublishedPhotoWall,
  PublishedPhotoWallLoading,
} from '~/components/published-photo-wall'
import { T } from '~/lib/i18n'
import { photos } from '~/lib/photos'
import { publicPageMetadata } from '~/lib/public-page-metadata'

export const metadata: Metadata = {
  title: publicPageMetadata.photos.zh.title,
  description: publicPageMetadata.photos.zh.description,
  alternates: {
    canonical: '/photos',
  },
}

export default function PhotosPage(): React.JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[37.5rem] px-6 py-6">
      <div className="flex items-start justify-between gap-4">
        <header className="max-w-[34rem]">
          <h1 className="page-eyebrow enter">
            <T zh="相册" en="Photos" />
          </h1>
          <p
            className="page-introduction enter mt-4 text-balance text-sm leading-relaxed text-[var(--muted-foreground)]"
            style={{ '--enter-delay': '70ms' } as React.CSSProperties}
          >
            <T
              zh={publicPageMetadata.photos.zh.description}
              en={publicPageMetadata.photos.en.description}
            />
          </p>
        </header>
        <PixelCluster variant={4} className="enter shrink-0" />
      </div>

      <Suspense fallback={<PublishedPhotoWallLoading />}>
        <PublishedPhotoWall photos={photos} />
      </Suspense>
    </div>
  )
}

'use client'

import React from 'react'
import { T } from '~/lib/i18n'
import { localize, useLocale } from '~/lib/locale-client'
import { type Photo } from '~/lib/photos'
import { tiltFromSlug } from '~/lib/polaroid'
import { ZoomImage } from './zoom-image'

function PhotoDetails({ photo }: { photo: Photo }): React.JSX.Element | null {
  const fields: { zh: string; en: string; value: string }[] = [
    { zh: '标题', en: 'Title', value: photo.title },
    { zh: '日期', en: 'Date', value: photo.date },
    ...(photo.location ? [{ zh: '地点', en: 'Location', value: photo.location }] : []),
    ...(photo.camera ? [{ zh: '拍摄/生成', en: 'Device', value: photo.camera }] : []),
    ...(photo.description ? [{ zh: '说明', en: 'Note', value: photo.description }] : []),
  ]

  if (fields.length === 0) return null

  // The caption sheet staggers in behind the print: each item carries its
  // order so the overlay's open state can spring them in one by one.
  return (
    <div className="mx-auto w-full max-w-xl px-5 text-foreground">
      <dl className="spec-plate spec-plate-flow zoom-detail-frame">
        {fields.map((field, index) => (
          <div
            key={field.en}
            className="zoom-detail-item"
            style={{ '--detail-index': index } as React.CSSProperties}
          >
            <dt>
              <T zh={field.zh} en={field.en} />
            </dt>
            <dd>{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function PublishedPhotoItem({
  photo,
  index,
  center,
}: {
  photo: Photo
  index: number
  center: number
}): React.JSX.Element {
  const locale = useLocale()
  const alt = localize(locale, photo.title, photo.titleEn)

  // Tiles stay quiet: location and capture data live exclusively in the lightbox details.
  return (
    <div
      className="photo-item enter-swing"
      data-photo-id={photo.id}
      style={
        {
          '--enter-delay': `${120 + Math.abs(index - center) * 50}ms`,
          '--img-tilt': `${(tiltFromSlug(photo.id) / 2).toFixed(2)}deg`,
        } as React.CSSProperties
      }
    >
      <div className="photo-frame relative overflow-hidden">
        <ZoomImage
          src={photo.src}
          alt={alt}
          width={photo.width}
          height={photo.height}
          sizes="(max-width: 704px) 50vw, 288px"
          expandedContent={<PhotoDetails photo={photo} />}
        />
        <span className="calibration-corners" aria-hidden />
      </div>
    </div>
  )
}

export function PublishedPhotoWall({
  photos,
}: {
  photos: Photo[]
}): React.JSX.Element {
  if (!photos || photos.length === 0) {
    return (
      <div className="darkroom-empty-state enter mt-8 rounded-lg border border-dashed border-[var(--border)] p-12 text-center bg-[var(--surface-1)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--muted-foreground)] mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <h3 className="text-sm font-medium text-[var(--foreground)] mb-1">
          <T zh="暗房冲印整理中" en="Darkroom in curation" />
        </h3>
        <p className="text-xs leading-relaxed text-[var(--muted-foreground)] max-w-sm mx-auto">
          <T
            zh="暂无公开照片展出。精选视觉成果与摄影作品正在暗房挑选调色中，稍后上线。"
            en="No photos published yet. Curated visual works are currently being refined in the darkroom."
          />
        </p>
      </div>
    )
  }

  const center = (photos.length - 1) / 2

  return (
    <div className="photo-masonry mt-6">
      {photos.map((photo, index) => (
        <PublishedPhotoItem
          key={photo.id}
          photo={photo}
          index={index}
          center={center}
        />
      ))}
    </div>
  )
}

export function PublishedPhotoWallLoading(): React.JSX.Element {
  return (
    <div className="photo-masonry mt-6" role="status" aria-busy="true">
      <span className="sr-only">
        <T zh="正在加载照片" en="Loading photos" />
      </span>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <span
          key={i}
          className="photo-item photo-masonry-placeholder"
          style={{ aspectRatio: i % 2 === 0 ? '4/3' : '3/4' }}
          aria-hidden
        />
      ))}
    </div>
  )
}

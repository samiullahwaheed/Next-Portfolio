'use client'

import { useEffect, useState } from 'react'
import type { GalleryState } from '@/types/portfolio'
import { GalleryModal } from '../layout/GalleryModal'
import { Icon } from '../ui/Icon'

// The hero cover image; clicking it opens the scrollable case-study viewer
export function ProjectGallery({ title, images }: { title: string; images: string[] }) {
  const [gallery, setGallery] = useState<GalleryState | null>(null)

  useEffect(() => {
    if (!gallery) return
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setGallery(null)
      if (event.key === 'ArrowLeft') setGallery((current) => current && { ...current, index: (current.index - 1 + current.images.length) % current.images.length })
      if (event.key === 'ArrowRight') setGallery((current) => current && { ...current, index: (current.index + 1) % current.images.length })
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [gallery])

  return (
    <>
      <button
        type="button"
        onClick={() => setGallery({ title, images, index: 0 })}
        aria-label={`Open ${title} image gallery (${images.length} images)`}
        className="group relative block w-full overflow-hidden bg-slate-100 dark:bg-slate-900"
      >
        <img src={images[0]} alt={`${title} preview`} className="mx-auto block h-auto max-h-[75vh] w-full object-contain transition duration-500 group-hover:brightness-90" />
        <span aria-hidden className="absolute inset-0 grid place-items-center bg-slate-950/0 transition duration-300 group-hover:bg-slate-950/45">
          <span className="inline-flex translate-y-2 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-900 opacity-0 shadow-lg transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Icon name="image" className="size-4" />
            {images.length > 1 ? `View all ${images.length} images` : 'View image'}
          </span>
        </span>
        {images.length > 1 && (
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            <Icon name="image" className="size-3.5" />
            1 / {images.length}
          </span>
        )}
      </button>

      {gallery && <GalleryModal gallery={gallery} setGallery={setGallery} />}
    </>
  )
}

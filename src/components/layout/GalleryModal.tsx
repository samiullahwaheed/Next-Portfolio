import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import type { GalleryState } from '../../types/portfolio'
import { Icon } from '../ui/Icon'

type GalleryModalProps = {
  gallery: GalleryState
  setGallery: Dispatch<SetStateAction<GalleryState | null>>
}

const floatingButton =
  'fixed z-[110] grid size-12 place-items-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur transition hover:scale-110 hover:border-[var(--accent)] hover:bg-[var(--accent)] max-sm:size-10'

// Image-only viewer: the screenshot renders wide and scrolls, so tall full-page captures stay readable
export function GalleryModal({ gallery, setGallery }: GalleryModalProps) {
  const { images, index, title } = gallery
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const src = images[index]

  const go = (step: number) => setGallery({ ...gallery, index: (index + step + images.length) % images.length })
  const close = () => setGallery(null)

  // Focus the scroll area so ↑ ↓ / Space scroll the screenshot; restart at the top on every image
  useEffect(() => {
    scrollRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [index])

  // Portaled to <body>: animated (transformed) ancestors would otherwise trap `fixed` inside them
  return createPortal(
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={`${title} image gallery`}>
      <div ref={scrollRef} tabIndex={-1} onClick={close} className="h-full overflow-y-auto outline-none">
        <div className="flex min-h-full items-start justify-center px-20 py-[4vh] max-sm:px-0 max-sm:py-16">
          {loadedSrc !== src && (
            <span aria-hidden className="fixed top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-[3px] border-white/20 border-t-[var(--accent)]" />
          )}
          <img
            key={src}
            src={src}
            alt={`${title} screenshot ${index + 1}`}
            onLoad={() => setLoadedSrc(src)}
            onClick={(event) => event.stopPropagation()}
            className={`h-auto w-full max-w-[1500px] rounded-xl shadow-[0_40px_120px_-20px_rgb(0_0_0/0.7)] transition-opacity duration-300 max-sm:rounded-none ${loadedSrc === src ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      <button className={`${floatingButton} top-5 right-5`} onClick={close} aria-label="Close gallery">
        <Icon name="close" />
      </button>
      {images.length > 1 && (
        <>
          <button className={`${floatingButton} top-1/2 left-4 -translate-y-1/2 max-sm:left-2`} onClick={() => go(-1)} aria-label="Previous image">
            <Icon name="left" />
          </button>
          <button className={`${floatingButton} top-1/2 right-4 -translate-y-1/2 max-sm:right-2`} onClick={() => go(1)} aria-label="Next image">
            <Icon name="right" />
          </button>
        </>
      )}
    </div>,
    document.body,
  )
}

import type { Dispatch, SetStateAction } from 'react'
import type { GalleryState } from '../../types/portfolio'
import { Icon } from '../ui/Icon'

type GalleryModalProps = {
  gallery: GalleryState
  setGallery: Dispatch<SetStateAction<GalleryState | null>>
}

export function GalleryModal({ gallery, setGallery }: GalleryModalProps) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-5 backdrop-blur" role="dialog" aria-modal="true" aria-label={`${gallery.title} image gallery`} onClick={() => setGallery(null)}>
      <button className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full border-2 border-rose-500 text-rose-500 transition hover:rotate-90 hover:bg-rose-600 hover:text-white" onClick={() => setGallery(null)} aria-label="Close gallery">
        <Icon name="close" />
      </button>
      <button
        className="absolute left-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border-2 border-rose-500 bg-black/40 text-rose-500 transition hover:scale-110 hover:bg-rose-600 hover:text-white sm:left-6"
        onClick={(event) => {
          event.stopPropagation()
          setGallery({ ...gallery, index: (gallery.index - 1 + gallery.images.length) % gallery.images.length })
        }}
        aria-label="Previous image"
      >
        <Icon name="left" />
      </button>
      <div className="max-h-[85vh] max-w-[80vw]" onClick={(event) => event.stopPropagation()}>
        <img src={gallery.images[gallery.index]} alt={`${gallery.title} screenshot ${gallery.index + 1}`} className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl" />
        <p className="mt-3 text-center text-sm text-white/80">{gallery.title} | {gallery.index + 1} / {gallery.images.length}</p>
      </div>
      <button
        className="absolute right-3 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border-2 border-rose-500 bg-black/40 text-rose-500 transition hover:scale-110 hover:bg-rose-600 hover:text-white sm:right-6"
        onClick={(event) => {
          event.stopPropagation()
          setGallery({ ...gallery, index: (gallery.index + 1) % gallery.images.length })
        }}
        aria-label="Next image"
      >
        <Icon name="right" />
      </button>
    </div>
  )
}

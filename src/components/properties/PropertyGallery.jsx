import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

const FALLBACK = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop'

export default function PropertyGallery({ images = [], title = '' }) {
  const imgs = images.length > 0 ? images : [FALLBACK]
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const prev = useCallback(() => setActive((i) => (i === 0 ? imgs.length - 1 : i - 1)), [imgs.length])
  const next = useCallback(() => setActive((i) => (i === imgs.length - 1 ? 0 : i + 1)), [imgs.length])

  // Keyboard navigation in lightbox
  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
    if (e.key === 'Escape') setLightbox(false)
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 group">
          <img
            src={imgs[active]}
            alt={`${title} — image ${active + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK }}
          />

          {/* Expand button */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-xl hover:bg-black/60 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="View fullscreen"
          >
            <Expand size={16} />
          </button>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg">
            {active + 1} / {imgs.length}
          </div>

          {/* Arrows (only when multiple images) */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 backdrop-blur-sm text-dark rounded-xl hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                aria-label="Previous image"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 backdrop-blur-sm text-dark rounded-xl hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                aria-label="Next image"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {imgs.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {imgs.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={[
                  'relative shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200',
                  active === i
                    ? 'border-primary shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100',
                ].join(' ')}
                aria-label={`View image ${i + 1}`}
              >
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = FALLBACK }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-label="Image gallery"
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors z-10"
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 text-white text-sm px-4 py-1.5 rounded-full">
            {active + 1} / {imgs.length}
          </div>

          {/* Image */}
          <div
            className="relative max-w-5xl w-full px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imgs[active]}
              alt={`${title} — image ${active + 1}`}
              className="w-full max-h-[80vh] object-contain rounded-xl"
              onError={(e) => { e.currentTarget.src = FALLBACK }}
            />
          </div>

          {/* Nav arrows */}
          {imgs.length > 1 && (
            <>
              <button
                className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}

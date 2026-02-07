import { useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Expand, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface HeroMediaCarouselProps {
  images: string[]
  videos?: string[]
  title: string
}

export function HeroMediaCarousel({ images, videos = [], title }: HeroMediaCarouselProps) {
  const [index, setIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const mediaItems = [...images.map((url) => ({ type: 'image' as const, url })), ...videos.map((url) => ({ type: 'video' as const, url }))]
  const hasMedia = mediaItems.length > 0
  const currentItem = hasMedia ? mediaItems[index] : null

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + mediaItems.length) % mediaItems.length)
    setZoomLevel(1)
  }, [mediaItems.length])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % mediaItems.length)
    setZoomLevel(1)
  }, [mediaItems.length])

  const openLightbox = useCallback(() => {
    setZoomLevel(1)
    setIsLightboxOpen(true)
  }, [])

  const toggleZoom = useCallback(() => {
    setZoomLevel((z) => (z >= 2 ? 1 : z + 0.5))
  }, [])

  if (!hasMedia) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Package className="h-24 w-24 opacity-50" />
          <span className="text-sm">No media available</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted group">
        {currentItem && currentItem.type === 'image' ? (
          <img
            src={currentItem.url}
            alt={`${title} - ${index + 1}`}
            className="h-full w-full object-cover transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
            onClick={toggleZoom}
          />
        ) : currentItem && currentItem.type === 'video' ? (
          <video
            src={currentItem.url}
            controls
            className="h-full w-full object-cover"
          />
        ) : null}

        {/* Overlay gradient for controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Navigation arrows */}
        {mediaItems.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
              onClick={goPrev}
              aria-label="Previous media"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
              onClick={goNext}
              aria-label="Next media"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Lightbox button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 bottom-2 h-10 w-10 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
          onClick={openLightbox}
          aria-label="Open lightbox"
        >
          <Expand className="h-5 w-5" />
        </Button>

        {/* Dots indicator */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {mediaItems.map((_, i) => (
              <button
                key={i}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === index ? 'w-6 bg-primary' : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                onClick={() => {
                  setIndex(i)
                  setZoomLevel(1)
                }}
                aria-label={`View media ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden border-0 bg-black/95"
          showClose={true}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{title} - Media viewer</DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center min-h-[70vh] p-4">
            {currentItem && currentItem.type === 'image' ? (
              <img
                src={currentItem.url}
                alt={title}
                className="max-h-[85vh] max-w-full object-contain rounded-lg"
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={toggleZoom}
              />
            ) : currentItem && currentItem.type === 'video' ? (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full object-contain rounded-lg"
              />
            ) : null}
            {mediaItems.length > 1 && currentItem && currentItem.type === 'image' && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
                  onClick={goPrev}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full"
                  onClick={goNext}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

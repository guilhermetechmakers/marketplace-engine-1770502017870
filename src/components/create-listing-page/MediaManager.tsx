import { useCallback, useState } from 'react'
import { Upload, X, ImageIcon, GripVertical, Crop } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface MediaItem {
  id: string
  url: string
  file?: File
  type: 'image' | 'video'
}

export interface MediaManagerProps {
  media: MediaItem[]
  onMediaChange: (media: MediaItem[]) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string
}

const DEFAULT_MAX_FILES = 10
const DEFAULT_MAX_SIZE_MB = 5
const DEFAULT_ACCEPTED = 'image/*,video/*'

function cropImageToAspect(
  sourceUrl: string,
  aspectRatio: number = 16 / 9
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const w = img.width
      const h = img.height
      const currentAspect = w / h
      let sw: number
      let sh: number
      let sx: number
      let sy: number
      if (currentAspect > aspectRatio) {
        sh = h
        sw = h * aspectRatio
        sx = (w - sw) / 2
        sy = 0
      } else {
        sw = w
        sh = w / aspectRatio
        sx = 0
        sy = (h - sh) / 2
      }
      const canvas = document.createElement('canvas')
      canvas.width = sw
      canvas.height = sh
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)
      canvas.toBlob(
        (blob) => resolve(blob || new Blob()),
        'image/jpeg',
        0.9
      )
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = sourceUrl
  })
}

function compressImage(file: File, maxSizeMB: number): Promise<Blob> {
  return new Promise((resolve) => {
    if (file.size <= maxSizeMB * 1024 * 1024) {
      resolve(file)
      return
    }
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height
      const targetSize = maxSizeMB * 1024 * 1024 * 0.9
      while (width * height * 0.8 > targetSize / 10 && width > 100 && height > 100) {
        width = Math.floor(width * 0.9)
        height = Math.floor(height * 0.9)
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(file)
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => resolve(blob || file),
        'image/jpeg',
        0.85
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }
    img.src = url
  })
}

export function MediaManager({
  media,
  onMediaChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED,
}: MediaManagerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [croppingItem, setCroppingItem] = useState<MediaItem | null>(null)
  const [isCropping, setIsCropping] = useState(false)

  const processFile = useCallback(
    async (file: File): Promise<MediaItem | null> => {
      const isImage = file.type.startsWith('image/')
      const isVideo = file.type.startsWith('video/')
      if (!isImage && !isVideo) {
        setUploadError('Only images and videos are allowed')
        return null
      }
      if (file.size > maxSizeMB * 1024 * 1024 && isImage) {
        try {
          const compressed = await compressImage(file, maxSizeMB)
          const blob = compressed instanceof Blob ? compressed : new Blob([compressed])
          const url = URL.createObjectURL(blob)
          return {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            url,
            file: new File([blob], file.name, { type: file.type }),
            type: isImage ? 'image' : 'video',
          }
        } catch {
          setUploadError('Failed to compress image')
          return null
        }
      }
      const url = URL.createObjectURL(file)
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url,
        file,
        type: isImage ? 'image' : 'video',
      }
    },
    [maxSizeMB]
  )

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return
      setUploadError(null)
      const remaining = maxFiles - media.length
      if (remaining <= 0) {
        setUploadError(`Maximum ${maxFiles} files allowed`)
        return
      }
      const toAdd = Array.from(files).slice(0, remaining)
      const newItems: MediaItem[] = []
      for (const file of toAdd) {
        const item = await processFile(file)
        if (item) newItems.push(item)
      }
      if (newItems.length) onMediaChange([...media, ...newItems])
    },
    [media, maxFiles, onMediaChange, processFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeItem = (id: string) => {
    const item = media.find((m) => m.id === id)
    if (item?.url) URL.revokeObjectURL(item.url)
    onMediaChange(media.filter((m) => m.id !== id))
  }

  const moveItem = (index: number, direction: number) => {
    const next = index + direction
    if (next < 0 || next >= media.length) return
    const copy = [...media]
    ;[copy[index], copy[next]] = [copy[next], copy[index]]
    onMediaChange(copy)
  }

  const applyCrop = async () => {
    if (!croppingItem || croppingItem.type !== 'image') return
    setIsCropping(true)
    try {
      const blob = await cropImageToAspect(croppingItem.url, 16 / 9)
      const url = URL.createObjectURL(blob)
      const file = new File([blob], croppingItem.file?.name || 'cropped.jpg', {
        type: 'image/jpeg',
      })
      const updated = media.map((m) =>
        m.id === croppingItem.id
          ? { ...m, url, file, type: 'image' as const }
          : m
      )
      if (croppingItem.url) URL.revokeObjectURL(croppingItem.url)
      onMediaChange(updated)
      setCroppingItem(null)
    } catch {
      setUploadError('Failed to crop image')
    } finally {
      setIsCropping(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'flex min-h-[180px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
        )}
      >
        <Upload className="mb-3 h-12 w-12 text-muted-foreground" />
        <p className="mb-1 text-sm font-medium text-foreground">
          Drag & drop images or videos here
        </p>
        <p className="mb-4 text-xs text-muted-foreground">
          Up to {maxFiles} files, max {maxSizeMB}MB each. Images are auto-compressed.
        </p>
        <label className="cursor-pointer">
          <input
            type="file"
            accept={acceptedTypes}
            multiple
            className="sr-only"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button type="button" variant="outline" size="sm">
            Browse files
          </Button>
        </label>
      </div>

      {uploadError && (
        <p className="text-sm text-destructive">{uploadError}</p>
      )}

      {media.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {media.map((item, index) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border bg-card p-2 shadow-card transition-all duration-300 hover:shadow-card-hover"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.type === 'image' && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-sm"
                      onClick={() => setCroppingItem(item)}
                      aria-label="Crop image"
                    >
                      <Crop className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => moveItem(index, -1)}
                    disabled={index === 0}
                    aria-label="Move left"
                  >
                    <GripVertical className="h-4 w-4 rotate-90" />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    onClick={() => moveItem(index, 1)}
                    disabled={index === media.length - 1}
                    aria-label="Move right"
                  >
                    <GripVertical className="h-4 w-4 -rotate-90" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                {item.type === 'image' ? (
                  <ImageIcon className="h-4 w-4" />
                ) : (
                  <span>Video</span>
                )}
                {index === 0 && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-primary">Primary</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!croppingItem} onOpenChange={(open) => !open && setCroppingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {croppingItem?.type === 'image' && (
            <div className="overflow-hidden rounded-lg border bg-muted">
              <img
                src={croppingItem.url}
                alt="Crop preview"
                className="max-h-[300px] w-full object-contain"
              />
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Center crop to 16:9 aspect ratio for optimal display.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCroppingItem(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={applyCrop}
              disabled={isCropping}
            >
              {isCropping ? 'Cropping...' : 'Apply Crop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

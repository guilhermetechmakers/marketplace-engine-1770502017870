import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Smartphone, Monitor } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PreviewPanelProps {
  title: string
  description?: string
  price?: number
  currency?: string
  images: string[]
  metaTitle?: string
  metaDescription?: string
}

export function PreviewPanel({
  title,
  description,
  price,
  currency = 'USD',
  images,
  metaTitle,
  metaDescription,
}: PreviewPanelProps) {
  const displayPrice = price != null ? `${currency} ${Number(price).toFixed(2)}` : '—'
  const seoTitle = metaTitle || title || 'Listing title'
  const seoDesc = metaDescription || description?.slice(0, 155) || 'Listing description'

  const ListingPreview = ({ size }: { size: 'desktop' | 'mobile' }) => (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-card shadow-card',
        size === 'desktop' && 'max-w-md',
        size === 'mobile' && 'max-w-[280px]'
      )}
    >
      <div className="aspect-video bg-muted">
        {images[0] ? (
          <img
            src={images[0]}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2">
          {title || 'Listing title'}
        </h3>
        <p className="mt-1 text-lg font-bold text-primary">{displayPrice}</p>
        {description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )

  return (
    <Card className="sticky top-4 transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="desktop" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="desktop" className="gap-2">
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="gap-2">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
          </TabsList>
          <TabsContent value="desktop" className="mt-4">
            <ListingPreview size="desktop" />
          </TabsContent>
          <TabsContent value="mobile" className="mt-4">
            <ListingPreview size="mobile" />
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-3 rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            SEO Preview
          </p>
          <div className="space-y-1">
            <p className="truncate text-sm font-medium text-primary">
              {seoTitle}
            </p>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {seoDesc}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

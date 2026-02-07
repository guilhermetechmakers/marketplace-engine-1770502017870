import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Star,
  MessageCircle,
  Share2,
  ChevronLeft,
  ChevronRight,
  Package,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useListing } from '@/hooks/use-listing'
import { toast } from 'sonner'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: listing, isLoading, isError } = useListing(id)
  const [imageIndex, setImageIndex] = useState(0)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground" />
          <p className="mt-2 font-medium text-foreground">Listing not found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            This listing may have been removed or does not exist
          </p>
          <Link to="/search">
            <Button variant="outline" className="mt-4">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = listing.images?.length ? listing.images : [null]
  const currentImage = images[imageIndex]

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: window.location.href,
      }).then(() => toast.success('Shared successfully')).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/search" className="hover:text-foreground transition-colors">
          Search
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {listing.title}
        </span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Media & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media carousel */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted">
            {currentImage ? (
              <img
                src={currentImage}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Package className="h-24 w-24 opacity-50" />
              </div>
            )}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                  onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-lg"
                  onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`h-2 rounded-full transition-all ${
                        i === imageIndex ? 'w-6 bg-primary' : 'w-2 bg-white/50'
                      }`}
                      onClick={() => setImageIndex(i)}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{listing.title}</CardTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="secondary">{listing.category}</Badge>
                    {listing.status === 'active' && (
                      <Badge variant="success">Active</Badge>
                    )}
                  </div>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${listing.price.toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}
                    {listing.currency}
                  </span>
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {listing.description}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Summary & Seller */}
        <div className="space-y-6">
          <Card className="sticky top-24 transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <p className="text-2xl font-bold text-primary">
                ${listing.price.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">
                  {' '}
                  {listing.currency}
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to={`/checkout?listing=${listing.id}`}>
                <Button className="w-full transition-transform hover:scale-[1.02]">
                  Buy / Book
                </Button>
              </Link>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/dashboard/buyer/messages?seller=${listing.sellerId}`}>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message Seller
                </Link>
              </Button>
              <Button
                variant="ghost"
                className="w-full"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:shadow-card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Seller
                {listing.seller?.verificationStatus === 'verified' && (
                  <ShieldCheck className="h-5 w-5 text-primary" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {listing.seller?.name?.charAt(0) ?? 'S'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{listing.seller?.name ?? 'Seller'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {listing.seller?.rating != null && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {listing.seller.rating}
                      </span>
                    )}
                    {listing.seller?.verificationStatus === 'verified' && (
                      <Badge variant="success" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

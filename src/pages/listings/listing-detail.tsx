import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Share2, Package } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/navbar'
import { useListing } from '@/hooks/use-listing'
import { useFieldSchemas } from '@/hooks/use-config'
import { HeroMediaCarousel } from '@/components/listing-detail-page/HeroMediaCarousel'
import { ListingSummaryCard } from '@/components/listing-detail-page/ListingSummaryCard'
import { DynamicAttributes } from '@/components/listing-detail-page/DynamicAttributes'
import { AvailabilityBookingCalendar } from '@/components/listing-detail-page/AvailabilityBookingCalendar'
import { SellerSidebar } from '@/components/listing-detail-page/SellerSidebar'
import { MessagingThreadAccess } from '@/components/listing-detail-page/MessagingThreadAccess'
import { ReviewsSection } from '@/components/listing-detail-page/ReviewsSection'
import { RelatedListingsRecommendations } from '@/components/listing-detail-page/RelatedListingsRecommendations'
import { toast } from 'sonner'

export function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { data: listing, isLoading, isError } = useListing(id)
  const { data: schemas } = useFieldSchemas(listing?.categoryId ?? undefined)
  const isSeller = !!(user && listing && user.id === listing.sellerId)

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: listing?.title,
          text: listing?.description,
          url: window.location.href,
        })
        .then(() => toast.success('Shared successfully'))
        .catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard')
    }
  }

  const handleContactSeller = () => {
    window.dispatchEvent(new CustomEvent('open-message-seller'))
  }

  useEffect(() => {
    if (listing) {
      document.title = `${listing.title} | Marketplace`
      return () => { document.title = 'Marketplace' }
    }
  }, [listing])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="aspect-video rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-secondary/30 p-12 text-center animate-fade-in">
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
      </div>
    )
  }

  const images = listing.images?.length ? listing.images : []
  const listingType =
    listing.category?.toLowerCase().includes('service') ? 'book' : 'buy'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          aria-label="Breadcrumb"
        >
          <Link to="/search" className="hover:text-foreground transition-colors">
            Search
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">
            {listing.title}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left: Media, Description, Attributes, Calendar, Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <HeroMediaCarousel
              images={images}
              title={listing.title}
            />

            <ListingSummaryCard
              listing={listing}
              primaryAction={listingType}
              isSeller={!!isSeller}
            />

            <Card className="transition-all duration-300 hover:shadow-card-hover lg:hidden">
              <CardHeader>
                <CardTitle>{listing.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="secondary">{listing.category}</Badge>
                  {listing.status === 'active' && (
                    <Badge variant="success">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description}
                </p>
              </CardContent>
            </Card>

            <DynamicAttributes listing={listing} schemas={schemas} />

            <AvailabilityBookingCalendar listing={listing} showBooking={true} />

            <ReviewsSection listingId={listing.id} />
          </div>

          {/* Right: Sticky sidebar */}
          <div className="space-y-6">
            <div className="hidden lg:block">
              <ListingSummaryCard
                listing={listing}
                primaryAction={listingType}
              />
            </div>

            <Card className="transition-all duration-300 hover:shadow-card-hover">
              <CardContent className="pt-6 space-y-4">
                {!isSeller && (
                  <MessagingThreadAccess
                    sellerId={listing.sellerId}
                    sellerName={listing.seller?.name}
                    listingId={listing.id}
                    listingTitle={listing.title}
                    trigger={
                      <Button
                        variant="outline"
                        className="w-full transition-transform hover:scale-[1.02]"
                      >
                        Message Seller
                      </Button>
                    }
                  />
                )}
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

            <SellerSidebar
              listing={listing}
              onContactClick={handleContactSeller}
            />
          </div>
        </div>

        <div className="mt-12">
          <RelatedListingsRecommendations listingId={listing.id} limit={4} />
        </div>
      </div>
    </div>
  )
}

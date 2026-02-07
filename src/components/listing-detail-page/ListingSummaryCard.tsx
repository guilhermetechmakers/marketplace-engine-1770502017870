import { Link } from 'react-router-dom'
import { ShieldCheck, Truck, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Listing } from '@/types/listings'

type ListingType = 'book' | 'buy' | 'quote'

interface ListingSummaryCardProps {
  listing: Listing
  primaryAction?: ListingType
  isSeller?: boolean
}

export function ListingSummaryCard({
  listing,
  primaryAction = 'buy',
  isSeller = false,
}: ListingSummaryCardProps) {
  const isVerified = listing.seller?.verificationStatus === 'verified'
  const hasShipping = listing.attributes?.shipping !== false

  const primaryCta = () => {
    if (isSeller) {
      return (
        <Link to={`/listings/${listing.id}/edit`}>
          <Button className="w-full transition-transform hover:scale-[1.02] shadow-lg">
            <Pencil className="mr-2 h-4 w-4" />
            Edit Listing
          </Button>
        </Link>
      )
    }
    switch (primaryAction) {
      case 'book':
        return (
          <Link to={`/checkout?listing=${listing.id}&type=book`}>
            <Button className="w-full transition-transform hover:scale-[1.02] shadow-lg">
              Book Now
            </Button>
          </Link>
        )
      case 'quote':
        return (
          <Button
            className="w-full transition-transform hover:scale-[1.02]"
            variant="outline"
            onClick={() => {
              // Opens messaging modal - handled by parent
              const event = new CustomEvent('open-message-seller', { detail: listing.sellerId })
              window.dispatchEvent(event)
            }}
          >
            Request Quote
          </Button>
        )
      default:
        return (
          <Link to={`/checkout?listing=${listing.id}`}>
            <Button className="w-full transition-transform hover:scale-[1.02] shadow-lg">
              Buy Now
            </Button>
          </Link>
        )
    }
  }

  return (
    <Card className="sticky top-24 transition-all duration-300 hover:shadow-card-hover border-2 border-primary/10">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {isVerified && (
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )}
          {hasShipping && (
            <Badge variant="secondary" className="gap-1">
              <Truck className="h-3.5 w-3.5" />
              Ships
            </Badge>
          )}
          {listing.status === 'active' && (
            <Badge variant="default">Active</Badge>
          )}
        </div>
        <CardTitle className="text-2xl mt-2">{listing.title}</CardTitle>
        <p className="text-3xl font-bold text-primary mt-2">
          ${listing.price.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {listing.currency}
          </span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {primaryCta()}
      </CardContent>
    </Card>
  )
}

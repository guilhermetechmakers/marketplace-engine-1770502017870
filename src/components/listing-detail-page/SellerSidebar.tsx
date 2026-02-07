import { Link } from 'react-router-dom'
import { MessageCircle, Star, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { Listing } from '@/types/listings'

interface SellerSidebarProps {
  listing: Listing
  onContactClick?: () => void
}

export function SellerSidebar({ listing, onContactClick }: SellerSidebarProps) {
  const seller = listing.seller
  const isVerified = seller?.verificationStatus === 'verified'
  const responseTime = 'Usually responds within 24 hours'

  if (!seller) return null

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Seller
          {isVerified && (
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
              {seller.name?.charAt(0) ?? 'S'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-lg">{seller.name ?? 'Seller'}</p>
            <div className="flex items-center gap-2 mt-1">
              {seller.rating != null && (
                <span className="flex items-center gap-1 text-sm font-medium">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {seller.rating.toFixed(1)}
                </span>
              )}
              {isVerified && (
                <Badge variant="success" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{responseTime}</p>

        {onContactClick ? (
          <Button
            className="w-full transition-transform hover:scale-[1.02]"
            variant="outline"
            onClick={onContactClick}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact Seller
          </Button>
        ) : (
          <Button
            className="w-full transition-transform hover:scale-[1.02]"
            variant="outline"
            asChild
          >
            <Link to={`/dashboard/buyer/messages?seller=${listing.sellerId}`}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Seller
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

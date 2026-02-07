import { useState } from 'react'
import { Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useListingReviews } from '@/hooks/use-listing'
import type { Review } from '@/types/listing-detail'

interface ReviewsSectionProps {
  listingId: string
  hasCompletedOrder?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'
          }`}
        />
      ))}
    </div>
  )
}

export function ReviewsSection({
  listingId,
  hasCompletedOrder = false,
}: ReviewsSectionProps) {
  const { data: reviews, isLoading } = useListingReviews(listingId)
  const [showWriteReview, setShowWriteReview] = useState(false)

  const hasReviews = reviews && reviews.length > 0
  const avgRating = hasReviews
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0
  const roundedAvg = Math.round(avgRating * 10) / 10

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Reviews
          </CardTitle>
          {hasReviews && (
            <div className="flex items-center gap-2">
              <StarRating rating={roundedAvg} />
              <span className="text-sm font-medium">
                {roundedAvg} ({reviews.length})
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasReviews ? (
          <ul className="space-y-4">
            {reviews.map((r: Review) => (
              <li
                key={r.id}
                className="rounded-lg border bg-secondary/30 p-4 animate-fade-in"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{r.buyerName ?? 'Anonymous'}</span>
                  <StarRating rating={r.rating} />
                </div>
                {r.title && (
                  <p className="font-medium mt-1 text-sm">{r.title}</p>
                )}
                {r.comment && (
                  <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 opacity-50 mb-2" />
            <p>No reviews yet</p>
            <p className="text-sm mt-1">Be the first to leave a review!</p>
          </div>
        )}

        {hasCompletedOrder && !showWriteReview && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowWriteReview(true)}
          >
            Write a Review
          </Button>
        )}

        {showWriteReview && (
          <div className="rounded-lg border bg-secondary/30 p-4 space-y-4 animate-fade-in">
            <p className="font-medium">Write your review</p>
            <p className="text-sm text-muted-foreground">
              Write review form would go here (post-completion only).
            </p>
            <Button variant="outline" onClick={() => setShowWriteReview(false)}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

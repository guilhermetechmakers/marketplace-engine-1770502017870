import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useRelatedListings } from '@/hooks/use-listing'
interface RelatedListingsRecommendationsProps {
  listingId: string
  limit?: number
}

export function RelatedListingsRecommendations({
  listingId,
  limit = 4,
}: RelatedListingsRecommendationsProps) {
  const { data: related, isLoading } = useRelatedListings(listingId, limit)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!related || related.length === 0) return null

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Related Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <Link
              key={item.id}
              to={`/listings/${item.id}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-xl border bg-secondary/30 transition-all duration-300 group-hover:shadow-card-hover group-hover:scale-[1.02]">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium line-clamp-2 text-sm group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

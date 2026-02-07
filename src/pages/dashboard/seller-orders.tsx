import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SellerOrdersPage() {
  const isLoading = false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Orders & Bookings</h1>
        <p className="mt-1 text-[#555555]">Process and fulfill orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders Panel</CardTitle>
          <CardDescription>Accept, mark fulfilled, and manage orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-secondary/50 p-12 text-center text-muted-foreground">
              No orders yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

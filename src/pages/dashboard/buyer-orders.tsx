import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function BuyerOrdersPage() {
  const isLoading = false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Orders</h1>
        <p className="mt-1 text-[#555555]">View and manage your orders</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Your past and active transactions</CardDescription>
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
              <p>No orders yet.</p>
              <Button variant="outline" className="mt-4">
                Browse Listings
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

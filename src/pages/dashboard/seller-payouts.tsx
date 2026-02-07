import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SellerPayoutsPage() {
  const isLoading = false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Payouts</h1>
        <p className="mt-1 text-[#555555]">Balance and payout schedule</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Balance</CardTitle>
            <CardDescription>Funds ready for payout</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : (
              <div className="text-2xl font-bold text-fresh">$0.00</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Next Payout</CardTitle>
            <CardDescription>Upcoming payout schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">—</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>Past transfers and schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-12 text-center text-muted-foreground">
            No payouts yet.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

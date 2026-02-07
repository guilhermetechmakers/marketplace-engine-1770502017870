import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BuyerMessagesPage() {
  const isLoading = false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Messages</h1>
        <p className="mt-1 text-[#555555]">Your conversations with sellers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>Thread list with unread badges</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border bg-secondary/50 p-12 text-center text-muted-foreground">
              No messages yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

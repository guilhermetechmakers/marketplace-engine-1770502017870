import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ModerationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Moderation Queue</h1>
        <p className="mt-1 text-[#555555]">Review flagged content and disputes</p>
      </div>

      <div className="flex gap-2 border-b">
        {['Listings', 'Reviews', 'Users', 'Disputes'].map((tab) => (
          <Button key={tab} variant="ghost" className="rounded-b-none border-b-2 border-transparent">
            {tab}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Queue Items</CardTitle>
          <p className="text-sm text-muted-foreground">Item detail with evidence, bulk actions</p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-12 text-center text-muted-foreground">
            No items in queue.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DisputesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Disputes</h1>
        <p className="mt-1 text-[#555555]">Case management for disputes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cases</CardTitle>
          <p className="text-sm text-muted-foreground">
            Case timeline, action panel (refund/partial/close/escalate)
          </p>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-12 text-center text-muted-foreground">
            No open disputes.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

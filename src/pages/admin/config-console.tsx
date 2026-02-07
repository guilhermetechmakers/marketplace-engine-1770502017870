import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ConfigConsolePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Configuration Console</h1>
        <p className="mt-1 text-[#555555]">Taxonomy, schemas, fees, feature flags</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Taxonomy Editor</CardTitle>
            <p className="text-sm text-muted-foreground">Category taxonomy</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Edit Taxonomy</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schema Builder</CardTitle>
            <p className="text-sm text-muted-foreground">Drag & drop schema</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Edit Schemas</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Fees & Commissions</CardTitle>
            <p className="text-sm text-muted-foreground">Platform fees</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Configure</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feature Flags</CardTitle>
            <p className="text-sm text-muted-foreground">Per-marketplace toggles</p>
          </CardHeader>
          <CardContent>
            <Button variant="outline">Edit Flags</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

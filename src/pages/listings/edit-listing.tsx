import { Link, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function EditListingPage() {
  const { id } = useParams()

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link to="/dashboard/seller/listings" className="text-sm text-fresh hover:underline">
          ← Back to listings
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-[#222222]">Edit Listing</h1>
        <p className="mt-1 text-[#555555]">
          Prefilled schema-driven form, version history, publish controls
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing #{id ?? '—'}</CardTitle>
          <CardDescription>Version history with diffs and rollback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-8 text-center text-muted-foreground">
            Schema-driven form will render here.
          </div>
          <div className="mt-6 flex gap-4">
            <Button>Save Draft</Button>
            <Button variant="outline">Publish</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

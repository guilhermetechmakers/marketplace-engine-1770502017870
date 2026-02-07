import { Link } from 'react-router-dom'
import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function SellerListingsPage() {
  const isLoading = false

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#222222]">Listings</h1>
          <p className="mt-1 text-[#555555]">Manage your listings with statuses</p>
        </div>
        <Link to="/listings/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Listing
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Listings</CardTitle>
          <CardDescription>Draft, published, and archived listings</CardDescription>
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
              <p>No listings yet.</p>
              <Link to="/listings/create">
                <Button className="mt-4">Create your first listing</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

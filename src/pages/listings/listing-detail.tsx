import { useParams } from 'react-router-dom'
import { Star, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ListingDetailPage() {
  const { id } = useParams()

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-2xl bg-secondary mb-6">
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Hero media carousel
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Listing #{id ?? '—'}</CardTitle>
              <p className="text-lg font-semibold text-fresh">$49.00</p>
            </CardHeader>
            <CardContent>
              <p className="text-[#555555]">
                Dynamic attributes from schema. Availability calendar. Full description.
              </p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <p className="text-2xl font-bold text-fresh">$49.00</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Buy / Book / Request Quote</Button>
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Message Seller
              </Button>
              <Button variant="ghost" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-secondary" />
                <div>
                  <p className="font-medium">Seller Name</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    4.8
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'

export function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-3xl font-bold text-[#222222]">Cart</h1>
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/search">
              <Button className="mt-4">Browse Listings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/layout/navbar'

export function SearchPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search keywords, location, date..."
              className="h-12 pl-12 rounded-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 md:flex-initial">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="flex-1 md:flex-initial">
              <MapPin className="mr-2 h-4 w-4" />
              Map
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link key={i} to={`/listings/${i}`}>
              <Card className="overflow-hidden transition-all hover:shadow-card-hover">
                <div className="aspect-[4/3] bg-secondary" />
                <CardContent className="p-4">
                  <p className="font-medium text-[#222222]">Listing {i}</p>
                  <p className="text-sm text-fresh">$49.00</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

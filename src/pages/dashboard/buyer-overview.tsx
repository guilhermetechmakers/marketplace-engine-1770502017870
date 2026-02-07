import { Link } from 'react-router-dom'
import { ShoppingBag, MessageSquare, Save, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function BuyerOverviewPage() {
  const isLoading = false
  const activeOrders = 2
  const unreadMessages = 3
  const savedSearches = 1

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#222222]">Buyer Dashboard</h1>
        <p className="mt-1 text-[#555555]">Manage your orders, saved items, and messages</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#222222]">{activeOrders}</div>
                <Link to="/dashboard/buyer/orders">
                  <Button variant="link" className="mt-2 h-auto p-0">
                    View orders
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unread Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#222222]">{unreadMessages}</div>
                <Link to="/dashboard/buyer/messages">
                  <Button variant="link" className="mt-2 h-auto p-0">
                    Open inbox
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saved Searches
            </CardTitle>
            <Save className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold text-[#222222]">{savedSearches}</div>
                <Link to="/search">
                  <Button variant="link" className="mt-2 h-auto p-0">
                    Browse
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-mint to-background">
          <CardHeader>
            <CardTitle className="text-lg">Quick Search</CardTitle>
            <CardDescription>
              Find listings, refine filters, and discover new items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/search">
              <Button>Search Listings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest orders and interactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-secondary/50 p-8 text-center text-muted-foreground">
            No recent activity yet. Start by searching for listings.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

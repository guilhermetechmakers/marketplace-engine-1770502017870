import { Link } from 'react-router-dom'
import { ShoppingBag, Package, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useOrders } from '@/hooks/use-orders'
import type { Order, OrderStatus } from '@/types/orders'

const ACTIVE_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
]
const PAST_STATUSES: OrderStatus[] = ['delivered', 'cancelled', 'disputed', 'refunded']

function getStatusBadgeVariant(status: OrderStatus) {
  switch (status) {
    case 'delivered':
    case 'confirmed':
      return 'success'
    case 'cancelled':
    case 'disputed':
    case 'refunded':
      return 'destructive'
    case 'processing':
    case 'shipped':
      return 'warning'
    default:
      return 'secondary'
  }
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-muted">
              {order.listingImage ? (
                <img
                  src={order.listingImage}
                  alt={order.listingTitle}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <Package className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div>
              <Link
                to={`/listings/${order.listingId}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {order.listingTitle}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                {order.quantity} × ${order.price.toFixed(2)} = $
                {order.total.toFixed(2)} {order.currency}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Order · {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status}
            </Badge>
            <p className="text-sm font-medium text-primary">
              ${order.total.toFixed(2)} {order.currency}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function SellerOrdersPage() {
  const { orders = [], isLoading, error } = useOrders({ role: 'seller' })
  const isError = !!error

  const activeOrders = orders.filter((o: Order) => ACTIVE_STATUSES.includes(o.status))
  const pastOrders = orders.filter((o: Order) => PAST_STATUSES.includes(o.status))

  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard/seller" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Orders</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders & Bookings</h1>
        <p className="mt-2 text-muted-foreground">
          Process and fulfill orders from buyers
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Orders Panel
          </CardTitle>
          <CardDescription>Accept, mark fulfilled, and manage orders</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-12 text-center">
              <p className="font-medium text-destructive">Failed to load orders</p>
              <p className="mt-1 text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border bg-secondary/30 p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-medium text-foreground">No orders yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                When buyers purchase your listings, orders will appear here
              </p>
              <Link to="/listings/create">
                <Button variant="outline" className="mt-4">
                  Create Listing
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastOrders.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="mt-6 space-y-4">
                {activeOrders.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No active orders
                  </p>
                ) : (
                  activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="past" className="mt-6 space-y-4">
                {pastOrders.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">
                    No past orders
                  </p>
                ) : (
                  pastOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

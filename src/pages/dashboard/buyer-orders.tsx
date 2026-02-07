import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  XCircle,
  AlertTriangle,
  Star,
  Package,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

function OrderCard({
  order,
  onCancel,
  onDispute,
  onReview,
  cancelLoading,
  disputeLoading,
}: {
  order: Order
  onCancel: (id: string) => void
  onDispute: (id: string, reason: string) => void
  onReview: (id: string) => void
  cancelLoading?: boolean
  disputeLoading?: boolean
}) {
  const canCancel = ['pending', 'confirmed'].includes(order.status)
  const canDispute = ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status)
  const canReview = order.status === 'delivered'

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
                Ordered {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status}
            </Badge>
            <div className="flex flex-wrap gap-2 justify-end">
              {canCancel && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCancel(order.id)}
                  disabled={cancelLoading}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Cancel
                </Button>
              )}
              {canDispute && (
                <OrderDisputeButton
                  orderId={order.id}
                  onDispute={onDispute}
                  disputeLoading={disputeLoading}
                />
              )}
              {canReview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReview(order.id)}
                >
                  <Star className="mr-1 h-4 w-4" />
                  Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OrderDisputeButton({
  orderId,
  onDispute,
  disputeLoading,
}: {
  orderId: string
  onDispute: (id: string, reason: string) => void
  disputeLoading?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <AlertTriangle className="mr-1 h-4 w-4" />
        Dispute
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Dispute</DialogTitle>
            <DialogDescription>
              Describe the issue with this order. Our team will review your dispute.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                placeholder="Describe the issue..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDispute(orderId, reason)
                setOpen(false)
                setReason('')
              }}
              disabled={!reason.trim() || disputeLoading}
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function BuyerOrdersPage() {
  const {
    orders = [],
    isLoading,
    error,
    cancelOrder,
    openDispute,
    cancelLoading,
    disputeLoading,
  } = useOrders({ role: 'buyer' })
  const isError = !!error

  const activeOrders = orders.filter((o: Order) => ACTIVE_STATUSES.includes(o.status))
  const pastOrders = orders.filter((o: Order) => PAST_STATUSES.includes(o.status))

  const handleCancel = async (id: string) => {
    await cancelOrder(id)
  }

  const handleDispute = async (id: string, reason: string) => {
    await openDispute(id, reason)
  }

  const handleReview = (_id: string) => {
    // Navigate to review flow - placeholder
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/dashboard/buyer" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Orders</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Orders</h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your orders. Cancel, dispute, or leave a review.
        </p>
      </div>

      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Order History
          </CardTitle>
          <CardDescription>Your past and active transactions</CardDescription>
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
                When you make a purchase, your orders will appear here
              </p>
              <Link to="/search">
                <Button variant="outline" className="mt-4">
                  Browse Listings
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
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={handleCancel}
                      onDispute={handleDispute}
                      onReview={handleReview}
                      cancelLoading={cancelLoading}
                      disputeLoading={disputeLoading}
                    />
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
                    <OrderCard
                      key={order.id}
                      order={order}
                      onCancel={handleCancel}
                      onDispute={handleDispute}
                      onReview={handleReview}
                      cancelLoading={cancelLoading}
                      disputeLoading={disputeLoading}
                    />
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

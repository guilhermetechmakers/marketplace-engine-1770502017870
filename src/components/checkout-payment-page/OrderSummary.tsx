import { Package, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { CheckoutItem, PriceBreakdown } from '@/types/checkout-payment'

interface OrderSummaryProps {
  items: CheckoutItem[]
  priceBreakdown?: PriceBreakdown | null
  /** Alias for priceBreakdown - used by PaymentPage */
  breakdown?: PriceBreakdown | null
  isLoading?: boolean
  className?: string
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function OrderSummary({
  items,
  priceBreakdown: priceBreakdownProp,
  breakdown,
  isLoading = false,
  className,
}: OrderSummaryProps) {
  const priceBreakdown = priceBreakdownProp ?? breakdown ?? null
  if (isLoading) {
    return (
      <Card className={cn('transition-all duration-300', className)}>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
          <Skeleton className="h-24 w-full mt-4" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Order Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No items in your order
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 rounded-lg border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-14 w-14 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-muted">
                    {item.type === 'booking' ? (
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.unitPrice, item.currency)}
                  </p>
                  {item.bookingDetails && (
                    <p className="text-xs text-muted-foreground mt-1">{item.bookingDetails}</p>
                  )}
                </div>
                <div className="text-right font-medium">
                  {formatCurrency(item.total, item.currency)}
                </div>
              </div>
            ))
          )}
        </div>

        {priceBreakdown && items.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(priceBreakdown.subtotal, priceBreakdown.currency)}</span>
            </div>
            {priceBreakdown.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(priceBreakdown.discount, priceBreakdown.currency)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(priceBreakdown.tax, priceBreakdown.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee</span>
              <span>{formatCurrency(priceBreakdown.platformFee, priceBreakdown.currency)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Commission (seller)</span>
              <span>{formatCurrency(priceBreakdown.commissionPreview, priceBreakdown.currency)}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 text-base">
              <span>Total</span>
              <span className="text-primary">
                {formatCurrency(priceBreakdown.total, priceBreakdown.currency)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

import { CreditCard, Smartphone, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { SavedPaymentMethod } from '@/types/checkout-payment'

interface PaymentMethodsProps {
  savedMethods: SavedPaymentMethod[]
  selectedMethodId: string | null
  onSelectMethod: (id: string | null) => void
  onAddNewCard: () => void
  /** Stripe Elements container ref - when Stripe is configured, render CardElement here */
  cardElementRef?: React.RefObject<HTMLDivElement | null>
  showWalletButtons?: boolean
  disabled?: boolean
  className?: string
}

export function PaymentMethods({
  savedMethods,
  selectedMethodId,
  onSelectMethod,
  onAddNewCard,
  cardElementRef,
  showWalletButtons = true,
  disabled = false,
  className,
}: PaymentMethodsProps) {
  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savedMethods.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Saved cards</p>
            <div className="space-y-2">
              {savedMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => onSelectMethod(method.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all duration-200',
                    'hover:border-primary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    selectedMethodId === method.id
                      ? 'border-primary bg-accent/50 ring-2 ring-primary/20'
                      : 'border-input bg-background',
                    disabled && 'pointer-events-none opacity-50'
                  )}
                >
                  <CreditCard className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium capitalize">{method.brand}</p>
                    <p className="text-sm text-muted-foreground">
                      •••• {method.last4} · Exp {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                  {method.isDefault && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Add new card</p>
          <div
            ref={cardElementRef}
            className="min-h-[44px] rounded-lg border border-input bg-background px-4 py-3 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
          >
            <p className="text-sm text-muted-foreground">
              Card details (Stripe Elements will render here when configured)
            </p>
          </div>
          <button
            type="button"
            disabled={disabled}
            onClick={onAddNewCard}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Enter card manually
          </button>
        </div>

        {showWalletButtons && (
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              disabled={disabled}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:shadow-sm disabled:opacity-50"
            >
              <Smartphone className="h-4 w-4" />
              Apple Pay
            </button>
            <button
              type="button"
              disabled={disabled}
              className="flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:shadow-sm disabled:opacity-50"
            >
              <Smartphone className="h-4 w-4" />
              Google Pay
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

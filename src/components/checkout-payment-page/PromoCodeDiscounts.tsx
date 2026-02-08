import { useState } from 'react'
import { Tag, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PromoResult {
  code: string
  discountAmount?: number
  discountPercent?: number
  valid: boolean
}

interface PromoCodeDiscountsProps {
  appliedCode?: string
  discountAmount?: number
  /** Object form used by PaymentPage */
  appliedPromo?: PromoResult | null
  onApply: (code: string) => void | Promise<void>
  onRemove?: () => void
  isLoading?: boolean
  currency?: string
  disabled?: boolean
  className?: string
}

function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function PromoCodeDiscounts({
  appliedCode: appliedCodeProp,
  discountAmount: discountAmountProp = 0,
  appliedPromo,
  onApply,
  onRemove,
  isLoading = false,
  currency = 'USD',
  disabled = false,
  className,
}: PromoCodeDiscountsProps) {
  const [code, setCode] = useState('')
  const [applyError, setApplyError] = useState<string | null>(null)

  const appliedCode = appliedCodeProp ?? appliedPromo?.code
  const discountAmount = discountAmountProp ?? appliedPromo?.discountAmount ?? 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) return
    setApplyError(null)
    try {
      await onApply(trimmed)
      setCode('')
    } catch (err) {
      setApplyError(err instanceof Error ? err.message : 'Invalid promo code')
    }
  }

  return (
    <Card className={cn('transition-all duration-300 hover:shadow-card-hover', className)}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-primary" />
          <span className="font-medium">Promo code &amp; discounts</span>
        </div>

        {applyError && (
          <p className="text-sm text-destructive mb-2">{applyError}</p>
        )}

        {appliedCode && (discountAmount > 0 || (appliedPromo?.discountPercent ?? 0) > 0) ? (
          <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-4">
            <div>
              <p className="font-medium text-foreground">{appliedCode}</p>
              <p className="text-sm text-muted-foreground">
                {appliedPromo?.discountPercent
                  ? `${appliedPromo.discountPercent}% off`
                  : `${formatCurrency(discountAmount, currency)} discount applied`}
              </p>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                disabled={disabled}
              >
                Remove
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              disabled={disabled || isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              variant="outline"
              disabled={!code.trim() || disabled || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

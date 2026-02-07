import { Loader2, Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PlaceOrderButtonProps {
  onClick: () => void
  isLoading?: boolean
  disabled?: boolean
  total?: string
  /** Custom label for button text (e.g. "Confirm Booking") */
  label?: string
  className?: string
}

export function PlaceOrderButton({
  onClick,
  isLoading = false,
  disabled = false,
  total,
  label,
  className,
}: PlaceOrderButtonProps) {
  const displayLabel = label ?? (total ? `Place Order · ${total}` : 'Place Order')
  return (
    <div className={cn('space-y-2', className)}>
      <Button
        type="button"
        size="lg"
        className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
        onClick={onClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing securely...
          </>
        ) : (
          <>
            <Lock className="h-5 w-5" />
            {displayLabel}
          </>
        )}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Shield className="h-3.5 w-3.5" />
        Secured with industry-standard encryption
      </p>
    </div>
  )
}

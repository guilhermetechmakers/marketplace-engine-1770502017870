import { Link } from 'react-router-dom'
import { CheckCircle2, XCircle, Package, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface SuccessFailureScreensProps {
  state?: 'success' | 'failure'
  /** Alias for state - used by PaymentPage */
  variant?: 'success' | 'failure'
  orderId?: string
  message?: string
  nextSteps?: string[]
  onRetry?: () => void
  className?: string
}

export function SuccessFailureScreens({
  state: stateProp,
  variant,
  orderId,
  message,
  nextSteps,
  onRetry,
  className,
}: SuccessFailureScreensProps) {
  const state = stateProp ?? variant ?? 'success'
  if (state === 'success') {
    return (
      <div
        className={cn(
          'animate-fade-in-up flex flex-col items-center justify-center py-16 px-4',
          className
        )}
      >
        <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 mb-6">
          <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Order confirmed!</h2>
        <p className="text-muted-foreground text-center mb-6">
          Thank you for your order. We&apos;ve sent a confirmation to your email.
        </p>
        {nextSteps && nextSteps.length > 0 && (
          <ul className="text-sm text-muted-foreground text-center mb-6 space-y-1">
            {nextSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ul>
        )}
        {orderId && (
          <Card className="w-full max-w-md mb-8">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-mono font-medium text-lg mt-1">{orderId}</p>
            </CardContent>
          </Card>
        )}
        {nextSteps && nextSteps.length > 0 && (
          <ul className="text-sm text-muted-foreground mb-6 space-y-1 text-left">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {step}
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/dashboard/buyer/orders">
            <Button size="lg" className="gap-2">
              View Orders
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/search">
            <Button variant="outline" size="lg" className="gap-2">
              <Package className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'animate-fade-in-up flex flex-col items-center justify-center py-16 px-4',
        className
      )}
    >
      <div className="rounded-full bg-destructive/10 p-6 mb-6">
        <XCircle className="h-16 w-16 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Payment failed</h2>
      <p className="text-muted-foreground text-center mb-6">
        {message ?? "We couldn't process your payment. Please try again or use a different payment method."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {onRetry && (
          <Button size="lg" onClick={onRetry} className="gap-2">
            Try Again
          </Button>
        )}
        <Link to="/cart">
          <Button variant="outline" size="lg" className="gap-2">
            Back to Cart
          </Button>
        </Link>
        <Link to="/search">
          <Button variant="ghost" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  )
}

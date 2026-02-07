import { FileText } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface PolicyAcceptanceProps {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  disabled?: boolean
  className?: string
}

export function PolicyAcceptance({
  checked,
  onChange,
  error,
  disabled = false,
  className,
}: PolicyAcceptanceProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        className={cn(
          'flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all duration-200',
          'hover:border-primary/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          checked && 'border-primary/50 bg-accent/30',
          error && 'border-destructive',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        <Checkbox
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          disabled={disabled}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <span className="font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            I accept the cancellation and refund policies
          </span>
          <p className="text-sm text-muted-foreground mt-1">
            By placing this order, you agree to our terms regarding order cancellations, refunds, and
            dispute resolution. Full policy available in our{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              Terms of Service
            </a>
            .
          </p>
        </div>
      </label>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

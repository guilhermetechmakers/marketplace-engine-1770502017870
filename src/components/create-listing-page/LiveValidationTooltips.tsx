import { HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { FieldValidation } from '@/types/config'

export interface LiveValidationTooltipProps {
  description?: string
  validations?: FieldValidation[]
  example?: string
  className?: string
}

function formatValidation(v: FieldValidation): string {
  switch (v.type) {
    case 'required':
      return 'Required'
    case 'min':
      return `Min: ${v.value}`
    case 'max':
      return `Max: ${v.value}`
    case 'pattern':
      return 'Must match pattern'
    case 'email':
      return 'Valid email'
    case 'url':
      return 'Valid URL'
    default:
      return v.message ?? v.type
  }
}

export function LiveValidationTooltip({
  description,
  validations = [],
  example,
  className,
}: LiveValidationTooltipProps) {
  const hasContent = description || validations.length > 0 || example
  if (!hasContent) return null

  return (
    <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Validation rules and help"
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              className
            )}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs space-y-2">
          {description && <p>{description}</p>}
          {validations.length > 0 && (
            <div>
              <p className="mb-1 font-medium">Rules:</p>
              <ul className="list-inside list-disc text-sm">
                {validations.map((v, i) => (
                  <li key={i}>{formatValidation(v)}</li>
                ))}
              </ul>
            </div>
          )}
          {example && (
            <p className="text-sm text-muted-foreground">
              Example: {example}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
  )
}

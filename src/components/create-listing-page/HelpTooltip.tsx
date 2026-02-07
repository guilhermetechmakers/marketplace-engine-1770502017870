import { HelpCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface HelpTooltipProps {
  content: string
  className?: string
}

export function HelpTooltip({ content, className }: HelpTooltipProps) {
  return (
    <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Help"
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              className
            )}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          {content}
        </TooltipContent>
      </Tooltip>
  )
}

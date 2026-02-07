import { Save, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface SaveDraftPublishButtonsProps {
  onSaveDraft: () => void
  onPublish: () => void
  isDraftLoading?: boolean
  isPublishLoading?: boolean
  publishDisabled?: boolean
  publishChecks?: { passed: boolean; label: string }[]
  className?: string
}

export function SaveDraftPublishButtons({
  onSaveDraft,
  onPublish,
  isDraftLoading = false,
  isPublishLoading = false,
  publishDisabled = false,
  publishChecks = [],
  className,
}: SaveDraftPublishButtonsProps) {
  const allChecksPassed = publishChecks.length === 0 || publishChecks.every((c) => c.passed)

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div className="space-y-2">
        {publishChecks.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {publishChecks.map((check, i) => (
              <li
                key={i}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1 text-sm',
                  check.passed ? 'bg-fresh/20 text-fresh-dark' : 'bg-muted text-muted-foreground'
                )}
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    check.passed ? 'bg-fresh' : 'bg-muted-foreground'
                  )}
                />
                {check.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isDraftLoading || isPublishLoading}
          className="transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover"
        >
          {isDraftLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Draft
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          disabled={publishDisabled || !allChecksPassed || isDraftLoading || isPublishLoading}
          className="bg-gradient-to-r from-primary to-fresh-dark transition-all duration-200 hover:scale-[1.02] hover:shadow-card-elevated"
        >
          {isPublishLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Publish
        </Button>
      </div>
    </div>
  )
}

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { HelpTooltip } from './HelpTooltip'
import type { Category } from '@/types/config'

export interface CategorySelectorProps {
  categories: Category[]
  value: string
  onValueChange: (value: string) => void
  isLoading?: boolean
  error?: string
  disabled?: boolean
}

export function CategorySelector({
  categories,
  value,
  onValueChange,
  isLoading = false,
  error,
  disabled = false,
}: CategorySelectorProps) {
  const rootCategories = categories.filter((c) => !c.parentId)

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label className="flex items-center gap-2">Category</Label>
        <Skeleton className="h-11 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor="category">Category</Label>
        <HelpTooltip
          content="Choose a category to load the dynamic form schema. Fields like title, price, and custom attributes are configured per category."
        />
      </div>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger id="category" className="transition-all duration-200 hover:border-primary/50">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {rootCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

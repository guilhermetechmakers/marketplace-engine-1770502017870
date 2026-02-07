import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Listing } from '@/types/listings'
import type { ListingFieldSchema } from '@/types/config'

interface DynamicAttributesProps {
  listing: Listing
  schemas?: ListingFieldSchema[]
}

function formatAttributeValue(
  value: unknown,
  schema?: ListingFieldSchema
): string {
  if (value == null) return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (typeof value === 'number') {
    if (schema?.type === 'currency') return `$${value.toFixed(2)}`
    return String(value)
  }
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getAttributeLabel(key: string, schemas?: ListingFieldSchema[]): string {
  const schema = schemas?.find((s) => s.key === key)
  return schema?.label ?? key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
}

export function DynamicAttributes({ listing, schemas }: DynamicAttributesProps) {
  const attributes = listing.attributes ?? {}
  const displayKeys = Object.keys(attributes).filter(
    (k) => !['title', 'description', 'price', 'images', 'shipping'].includes(k)
  )

  if (displayKeys.length === 0) return null

  // Group by common prefixes or show as flat list
  const groups: Record<string, Record<string, unknown>> = {}
  displayKeys.forEach((key) => {
    const parts = key.split('_')
    const group = parts.length > 1 ? parts[0] : 'details'
    if (!groups[group]) groups[group] = {}
    groups[group][key] = attributes[key]
  })

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groups).map(([groupKey, groupAttrs]) => (
          <div key={groupKey} className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {groupKey === 'details' ? 'Specifications' : groupKey}
            </h4>
            <dl className="grid gap-2 sm:grid-cols-2">
              {Object.entries(groupAttrs).map(([key, value]) => {
                const schema = schemas?.find((s) => s.key === key)
                return (
                  <div
                    key={key}
                    className="flex flex-col rounded-lg border bg-secondary/30 px-4 py-3"
                  >
                    <dt className="text-xs font-medium text-muted-foreground">
                      {getAttributeLabel(key, schemas)}
                    </dt>
                    <dd className="mt-1 font-medium">
                      {formatAttributeValue(value, schema)}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

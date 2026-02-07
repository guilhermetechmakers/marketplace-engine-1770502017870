import { Controller } from 'react-hook-form'
import type { Control, FieldValues, Path } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MediaManager, type MediaItem } from '@/components/create-listing-page/MediaManager'
import { HelpTooltip } from '@/components/create-listing-page/HelpTooltip'
import type { ListingFieldSchema } from '@/types/config'

export interface SchemaFieldRendererProps<T extends FieldValues> {
  schema: ListingFieldSchema
  control: Control<T>
  /** Form field path - must be a valid key of T */
  name: Path<T>
  disabled?: boolean
}

/** Convert MediaItem[] to string[] (URLs) for storage */
function mediaToUrls(media: MediaItem[]): string[] {
  return media.map((m) => m.url)
}

/** Convert string[] to MediaItem[] for editing */
function urlsToMedia(urls: string[]): MediaItem[] {
  return urls.map((url, i) => ({
    id: `img-${i}-${url.slice(-8)}`,
    url,
    type: 'image' as const,
  }))
}

export function SchemaFieldRenderer<T extends FieldValues>({
  schema,
  control,
  name,
  disabled = false,
}: SchemaFieldRendererProps<T>) {
  const id = `field-${schema.key}`

  if (schema.type === 'image') {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const media: MediaItem[] = Array.isArray(field.value)
            ? urlsToMedia(field.value as string[])
            : []
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={id}>{schema.label}</Label>
                {schema.description && (
                  <HelpTooltip content={schema.description} />
                )}
              </div>
              <MediaManager
                media={media}
                onMediaChange={(items) => field.onChange(mediaToUrls(items))}
                maxFiles={10}
                maxSizeMB={5}
                acceptedTypes="image/*"
              />
            </div>
          )
        }}
      />
    )
  }

  if (schema.type === 'textarea') {
    return (
      <Controller
        control={control}
        name={name}
        rules={
          schema.isRequired
            ? { required: schema.validations?.[0]?.message ?? 'Required' }
            : undefined
        }
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={id}>{schema.label}</Label>
              {schema.description && (
                <HelpTooltip content={schema.description} />
              )}
            </div>
            <Textarea
              id={id}
              placeholder={schema.placeholder}
              disabled={disabled}
              className="min-h-[120px] resize-y transition-all duration-200 focus:border-primary/50"
              {...field}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    )
  }

  if (schema.type === 'currency') {
    return (
      <Controller
        control={control}
        name={name}
        rules={
          schema.isRequired
            ? { required: schema.validations?.[0]?.message ?? 'Required' }
            : undefined
        }
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={id}>{schema.label}</Label>
              {schema.description && (
                <HelpTooltip content={schema.description} />
              )}
            </div>
            <Input
              id={id}
              type="number"
              step="0.01"
              min={0}
              placeholder={schema.placeholder ?? '0.00'}
              disabled={disabled}
              className="transition-all duration-200 focus:border-primary/50"
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const v = e.target.value
                field.onChange(v === '' ? undefined : parseFloat(v))
              }}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    )
  }

  if (schema.type === 'number') {
    return (
      <Controller
        control={control}
        name={name}
        rules={
          schema.isRequired
            ? { required: schema.validations?.[0]?.message ?? 'Required' }
            : undefined
        }
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={id}>{schema.label}</Label>
              {schema.description && (
                <HelpTooltip content={schema.description} />
              )}
            </div>
            <Input
              id={id}
              type="number"
              placeholder={schema.placeholder}
              disabled={disabled}
              className="transition-all duration-200 focus:border-primary/50"
              {...field}
              value={field.value ?? ''}
              onChange={(e) => {
                const v = e.target.value
                field.onChange(v === '' ? undefined : parseFloat(v))
              }}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    )
  }

  if (schema.type === 'checkbox') {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={id}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
            <Label htmlFor={id} className="cursor-pointer font-normal">
              {schema.label}
            </Label>
            {schema.description && (
              <HelpTooltip content={schema.description} />
            )}
          </div>
        )}
      />
    )
  }

  if (schema.type === 'select') {
    const options = schema.options ?? []
    return (
      <Controller
        control={control}
        name={name}
        rules={
          schema.isRequired
            ? { required: schema.validations?.[0]?.message ?? 'Required' }
            : undefined
        }
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={id}>{schema.label}</Label>
              {schema.description && (
                <HelpTooltip content={schema.description} />
              )}
            </div>
            <Select
              value={field.value ?? ''}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id={id}
                className="transition-all duration-200 hover:border-primary/50"
              >
                <SelectValue placeholder={schema.placeholder ?? 'Select...'} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-destructive">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    )
  }

  // text, url, email, phone, date
  return (
    <Controller
      control={control}
      name={name}
      rules={
        schema.isRequired
          ? { required: schema.validations?.[0]?.message ?? 'Required' }
          : undefined
      }
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={id}>{schema.label}</Label>
            {schema.description && (
              <HelpTooltip content={schema.description} />
            )}
          </div>
          <Input
            id={id}
            type={
              schema.type === 'email'
                ? 'email'
                : schema.type === 'url'
                  ? 'url'
                  : schema.type === 'phone'
                    ? 'tel'
                    : schema.type === 'date'
                      ? 'date'
                      : 'text'
            }
            placeholder={schema.placeholder}
            disabled={disabled}
            className="transition-all duration-200 focus:border-primary/50"
            {...field}
            value={field.value ?? ''}
          />
          {fieldState.error && (
            <p className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  )
}

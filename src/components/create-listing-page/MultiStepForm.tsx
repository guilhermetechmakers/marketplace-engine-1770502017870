import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LiveValidationTooltip } from './LiveValidationTooltips'
import type { ListingFieldSchema } from '@/types/config'
import { cn } from '@/lib/utils'

export interface FormFieldProps {
  schema: ListingFieldSchema
  error?: string
}

function FormFieldByType({ schema, error }: FormFieldProps) {
  const { register, setValue, watch } = useFormContext()
  const name = schema.key
  const value = watch(name)

  const baseInputClass =
    'transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring'

  const labelContent = (
    <div className="flex items-center gap-2">
      <Label htmlFor={name}>{schema.label}</Label>
      {schema.isRequired && <span className="text-destructive">*</span>}
      {(schema.description || schema.validations?.length || schema.placeholder) && (
        <LiveValidationTooltip
          description={schema.description}
          validations={schema.validations}
          example={schema.placeholder}
        />
      )}
    </div>
  )

  switch (schema.type) {
    case 'text':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            placeholder={schema.placeholder}
            {...register(name)}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'textarea':
      return (
        <div className="space-y-2">
          {labelContent}
          <Textarea
            id={name}
            placeholder={schema.placeholder}
            {...register(name)}
            rows={4}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'number':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            type="number"
            placeholder={schema.placeholder}
            {...register(name, { valueAsNumber: true })}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'currency':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            type="number"
            step="0.01"
            min="0"
            placeholder={schema.placeholder || '0.00'}
            {...register(name, { valueAsNumber: true })}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'select':
      if (!schema.options?.length) {
        return (
          <div className="space-y-2">
            {labelContent}
            <p className="text-sm text-muted-foreground">
              No options configured for this field.
            </p>
          </div>
        )
      }
      return (
        <div className="space-y-2">
          {labelContent}
          <Select value={value ?? ''} onValueChange={(v) => setValue(name, v)}>
            <SelectTrigger
              id={name}
              className={cn(baseInputClass, error && 'border-destructive')}
            >
              <SelectValue placeholder={schema.placeholder || 'Select...'} />
            </SelectTrigger>
            <SelectContent>
              {schema.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'multiselect': {
      const current: string[] = Array.isArray(value) ? value : value ? [String(value)] : []
      const toggle = (optValue: string) => {
        const next = current.includes(optValue)
          ? current.filter((v) => v !== optValue)
          : [...current, optValue]
        setValue(name, next)
      }
      return (
        <div className="space-y-2">
          {labelContent}
          <div className="flex flex-wrap gap-2">
            {schema.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50"
              >
                <input
                  type="checkbox"
                  checked={current.includes(opt.value)}
                  onChange={() => toggle(opt.value)}
                  className="rounded border-input"
                />
                {opt.label}
              </label>
            ))}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )
    }

    case 'checkbox':
      return (
        <div className="flex items-center gap-2">
          <Checkbox
            id={name}
            checked={!!value}
            onCheckedChange={(v) => setValue(name, !!v)}
          />
          {labelContent}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'date':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            type="date"
            {...register(name)}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'url':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            type="url"
            placeholder={schema.placeholder}
            {...register(name)}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'email':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            type="email"
            placeholder={schema.placeholder}
            {...register(name)}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'phone':
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            type="tel"
            placeholder={schema.placeholder}
            {...register(name)}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )

    case 'image':
      return (
        <div className="space-y-2">
          {labelContent}
          <p className="text-sm text-muted-foreground">
            Use the Media Manager below to upload images.
          </p>
        </div>
      )

    default:
      return (
        <div className="space-y-2">
          {labelContent}
          <Input
            id={name}
            placeholder={schema.placeholder}
            {...register(name)}
            className={cn(baseInputClass, error && 'border-destructive')}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )
  }
}

export interface MultiStepFormProps {
  schemas: ListingFieldSchema[]
  errors: Record<string, { message?: string } | undefined>
}

export function MultiStepForm({ schemas, errors }: MultiStepFormProps) {
  const orderedSchemas = [...schemas].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6 animate-fade-in">
      {orderedSchemas.map((schema) => (
        <FormFieldByType
          key={schema.id}
          schema={schema}
          error={errors[schema.key]?.message}
        />
      ))}
    </div>
  )
}

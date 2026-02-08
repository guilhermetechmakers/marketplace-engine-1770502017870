import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ChevronLeft, ChevronRight, Calendar, Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
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

function getDaysInMonth(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const days: Date[] = []
  for (let d = new Date(first); d <= last; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d))
  }
  return days
}

function getStartPadding(year: number, month: number) {
  const first = new Date(year, month, 1)
  return first.getDay()
}

function AvailabilityCalendarField({
  name,
  value,
  setValue,
  labelContent,
  error,
}: {
  name: string
  value: unknown
  setValue: (name: string, value: unknown) => void
  labelContent: React.ReactNode
  error?: string
}) {
  const [viewDate, setViewDate] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const selectedDates: string[] = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value ? value.split(',').filter(Boolean) : []
      : []
  const toggleDate = (dateStr: string) => {
    const next = selectedDates.includes(dateStr)
      ? selectedDates.filter((s) => s !== dateStr)
      : [...selectedDates, dateStr].sort()
    setValue(name, next)
  }
  const days = getDaysInMonth(viewDate.year, viewDate.month)
  const padding = getStartPadding(viewDate.year, viewDate.month)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthLabel = new Date(viewDate.year, viewDate.month).toLocaleString(
    'default',
    { month: 'long', year: 'numeric' }
  )
  const goPrev = () =>
    setViewDate((p) =>
      p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 }
    )
  const goNext = () =>
    setViewDate((p) =>
      p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 }
    )
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return (
    <div className="space-y-2">
      {labelContent}
      <div className="rounded-xl border bg-muted/30 p-4 transition-all duration-300 hover:border-primary/30">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">{monthLabel}</span>
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={goPrev}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={goNext}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {weekDays.map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
          {Array.from({ length: padding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {days.map((date) => {
            const dateStr = date.toISOString().slice(0, 10)
            const isSelected = selectedDates.includes(dateStr)
            const dateObj = new Date(date)
            dateObj.setHours(0, 0, 0, 0)
            const isPast = dateObj < today
            return (
              <button
                key={dateStr}
                type="button"
                onClick={() => !isPast && toggleDate(dateStr)}
                disabled={isPast}
                className={cn(
                  'aspect-square rounded-lg text-sm font-medium transition-colors',
                  isPast && 'cursor-not-allowed text-muted-foreground/40',
                  !isPast && isSelected && 'bg-primary text-primary-foreground hover:bg-primary/90',
                  !isPast && !isSelected && 'hover:bg-primary/20 hover:text-primary'
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          Click dates to mark as available
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

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

    case 'availability':
      return (
        <AvailabilityCalendarField
          name={name}
          value={value}
          setValue={setValue}
          labelContent={labelContent}
          error={error}
        />
      )

    case 'date_range': {
      const rangeVal = typeof value === 'string' ? value : ''
      const [start, end] = rangeVal ? rangeVal.split(',') : ['', '']
      return (
        <div className="space-y-2">
          {labelContent}
          <div className="flex flex-wrap gap-2">
            <Input
              id={`${name}-start`}
              type="date"
              value={start}
              onChange={(e) => {
                const s = e.target.value
                setValue(name, end ? `${s},${end}` : s)
              }}
              className={cn(baseInputClass, error && 'border-destructive')}
            />
            <Input
              id={`${name}-end`}
              type="date"
              value={end}
              onChange={(e) => {
                const ed = e.target.value
                setValue(name, start ? `${start},${ed}` : ed)
              }}
              className={cn(baseInputClass, error && 'border-destructive')}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )
    }

    case 'file':
      return (
        <div className="space-y-2">
          {labelContent}
          <label
            className={cn(
              'flex min-h-[100px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all duration-200',
              'border-muted-foreground/25 bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
            )}
          >
            <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
            <span className="text-sm font-medium">Upload file</span>
            <span className="text-xs text-muted-foreground">
              {schema.placeholder || 'PDF, DOC, images up to 10MB'}
            </span>
            <input
              type="file"
              className="sr-only"
              accept={schema.options?.map((o) => o.value).join(',') || '*'}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setValue(name, file.name)
              }}
            />
          </label>
          {value && (
            <p className="text-sm text-muted-foreground">
              Selected: {typeof value === 'string' ? value : (value as File)?.name}
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
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

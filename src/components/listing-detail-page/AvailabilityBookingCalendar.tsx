import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Listing } from '@/types/listings'
import type { AvailabilitySlot } from '@/types/listing-detail'

interface AvailabilityBookingCalendarProps {
  listing: Listing
  availability?: AvailabilitySlot[]
  onDateSelect?: (date: string) => void
  showBooking?: boolean
}

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

export function AvailabilityBookingCalendar({
  listing,
  availability = [],
  onDateSelect,
  showBooking = true,
}: AvailabilityBookingCalendarProps) {
  const today = new Date()
  const [viewDate, setViewDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  })

  const isBookable = listing.category?.toLowerCase().includes('service') ?? false
  if (!showBooking || !isBookable) return null

  const days = getDaysInMonth(viewDate.year, viewDate.month)
  const padding = getStartPadding(viewDate.year, viewDate.month)

  const goPrev = () => {
    setViewDate((prev) =>
      prev.month === 0
        ? { year: prev.year - 1, month: 11 }
        : { ...prev, month: prev.month - 1 }
    )
  }

  const goNext = () => {
    setViewDate((prev) =>
      prev.month === 11
        ? { year: prev.year + 1, month: 0 }
        : { ...prev, month: prev.month + 1 }
    )
  }

  const monthLabel = new Date(viewDate.year, viewDate.month).toLocaleString(
    'default',
    { month: 'long', year: 'numeric' }
  )

  const isAvailable = (date: Date) => {
    const key = date.toISOString().slice(0, 10)
    const slot = availability.find((a) => a.date === key)
    return slot?.available ?? true
  }

  const isPast = (date: Date) => date < new Date(today.toDateString()) && date.getDate() !== today.getDate()

  const handleDateClick = (date: Date) => {
    if (isPast(date)) return
    const key = date.toISOString().slice(0, 10)
    onDateSelect?.(key)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Availability
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goPrev}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={goNext}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{monthLabel}</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {weekDays.map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 mt-2">
          {Array.from({ length: padding }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}
          {days.map((date) => {
            const avail = isAvailable(date)
            const past = isPast(date)
            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={past || !avail}
                className={cn(
                  'aspect-square rounded-lg text-sm font-medium transition-colors',
                  past && 'text-muted-foreground/50 cursor-not-allowed',
                  !past && avail && 'hover:bg-primary/20 hover:text-primary',
                  !past && !avail && 'text-muted-foreground/70 cursor-not-allowed',
                  !past && avail && 'bg-secondary/50'
                )}
              >
                {date.getDate()}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

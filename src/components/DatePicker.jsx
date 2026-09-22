import { format } from 'date-fns'
import { FiCalendar } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

/**
 * Shared single-date picker (Popover + shadcn Calendar) so every date field
 * in the app looks and behaves the same, instead of the browser's native
 * <input type="date"> widget (inconsistent styling across OS/browsers, no
 * theming). value/onChange stay 'yyyy-MM-dd' strings — the same contract the
 * native input had — so callers didn't need to change how they store dates.
 */
export function DatePicker({ id, value, onChange, onBlur, placeholder = 'Pick a date', className, disabled, ...props }) {
  const selected = value ? new Date(`${value}T00:00:00`) : undefined

  return (
    <Popover onOpenChange={(open) => !open && onBlur?.()}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn('w-full justify-start font-normal', !value && 'text-muted-foreground', className)}
          {...props}
        >
          <FiCalendar className="size-4" />
          {selected ? format(selected, 'MMM d, yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
        />
      </PopoverContent>
    </Popover>
  )
}

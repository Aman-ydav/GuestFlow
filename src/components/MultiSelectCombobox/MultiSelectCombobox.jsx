import { useState } from 'react'
import { FiChevronDown, FiX, FiSearch } from 'react-icons/fi'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { AvatarInitials } from '@/components/AvatarInitials'
import { cn } from '@/lib/utils'

/**
 * Looks like a shadcn <Select> trigger; selected items render as removable
 * chips BELOW the trigger (not inside it) — matches the "ADDED GUESTS" panel
 * in the original case-study reference screenshot. Built on Command + Popover,
 * not a new dependency. See docs/06-component-library-shadcn.md.
 *
 * @param {{id: string, name: string, meta?: string}[]} options
 * @param {string[]} value - selected option ids
 * @param {(next: string[]) => void} onChange
 */
export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = 'Search by name, id, email or phone',
  searchPlaceholder = 'Search by name, id, email or phone',
  emptyText = 'No matches found',
  className,
}) {
  const [open, setOpen] = useState(false)
  const selectedOptions = options.filter((o) => value.includes(o.id))

  const toggle = (id) => {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }
  const remove = (id) => onChange(value.filter((v) => v !== id))

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <FiSearch className="size-4 shrink-0" />
              {placeholder}
            </span>
            <FiChevronDown className="size-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = value.includes(option.id)
                  return (
                    <CommandItem
                      key={option.id}
                      value={`${option.name} ${option.meta ?? ''}`}
                      onSelect={() => toggle(option.id)}
                      className="gap-2"
                    >
                      <AvatarInitials name={option.name} size="sm" />
                      <span className="flex-1">{option.name}</span>
                      <span
                        className={cn(
                          'flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50'
                        )}
                      >
                        {isSelected && '✓'}
                      </span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedOptions.length > 0 && (
        <div className="space-y-1" aria-label="Added guests">
          <p className="px-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">Added Guests</p>
          <ul className="space-y-1">
            {selectedOptions.map((option) => (
              <li
                key={option.id}
                className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5"
              >
                <AvatarInitials name={option.name} size="sm" />
                <span className="flex-1 text-sm">{option.name}</span>
                <button
                  type="button"
                  onClick={() => remove(option.id)}
                  aria-label={`Remove ${option.name}`}
                  className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <FiX className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

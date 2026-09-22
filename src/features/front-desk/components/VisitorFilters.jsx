import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiSearch, FiX } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/DatePicker'
import { STATUS_TOKENS } from '@/lib/statusTokens'
import { useDebounce } from '@/hooks/useDebounce'
import { filterChanged, filtersReset, selectFilters } from '@/core/uiSlice'

const STATUS_OPTIONS = Object.keys(STATUS_TOKENS).filter((s) => s !== 'overstay') // overstay is derived, not a filter a user picks

export function VisitorFilters() {
  const dispatch = useDispatch()
  const filters = useSelector(selectFilters)
  const [query, setQuery] = useState(filters.query)
  const debouncedQuery = useDebounce(query, 300)

  // debounce the search box specifically — status/date filters apply immediately (they're discrete)
  useEffect(() => {
    dispatch(filterChanged({ query: debouncedQuery }))
  }, [debouncedQuery, dispatch])

  const hasActiveFilters = filters.status || filters.date || filters.query

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1">
        <FiSearch className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or phone"
          className="pl-9"
        />
      </div>
      <Select value={filters.status || 'all'} onValueChange={(v) => dispatch(filterChanged({ status: v === 'all' ? '' : v }))}>
        <SelectTrigger className="w-44"><SelectValue placeholder="All statuses" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{STATUS_TOKENS[s].label}</SelectItem>)}
        </SelectContent>
      </Select>
      <DatePicker
        value={filters.date}
        onChange={(date) => dispatch(filterChanged({ date }))}
        placeholder="Any date"
        className="w-40"
      />
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={() => { setQuery(''); dispatch(filtersReset()); }}>
          <FiX className="size-3.5" /> Clear
        </Button>
      )}
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FiChevronLeft, FiChevronRight, FiUsers } from 'react-icons/fi'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { AvatarInitials } from '@/components/AvatarInitials'
import { StatusBadge } from '@/components/StatusBadge'
import { getDisplayStatus } from '@/lib/statusTokens'
import { formatTime } from '@/lib/dateUtils'
import { hostSelectors } from '@/features/approval/hostsSlice'
import { selectOverstayMinutes } from '@/features/admin/configSlice'

const PAGE_SIZE = 15

/**
 * Complexity: rendering is O(page size), not O(n) — pagination keeps the DOM
 * cost flat regardless of how many visitors are in the filtered set (see
 * docs/design-decisions.md). `visitors` is already the filtered/searched
 * result from selectVisibleVisitors — this component only slices a page.
 */
export function VisitorTable({ visitors, onRowClick }) {
  const [page, setPage] = useState(0)
  const overstayMinutes = useSelector(selectOverstayMinutes)
  const hostEntities = useSelector(hostSelectors.selectEntities)

  const pageCount = Math.max(1, Math.ceil(visitors.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount - 1)
  const pageRows = useMemo(
    () => visitors.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE),
    [visitors, safePage]
  )

  if (visitors.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border py-14 text-center">
        <FiUsers className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">No visitors match these filters</p>
        <p className="text-xs text-muted-foreground">Try clearing search, status, or date.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor</TableHead>
              <TableHead className="hidden sm:table-cell">Type</TableHead>
              <TableHead>Entry Time</TableHead>
              <TableHead className="hidden md:table-cell">Exit Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((visitor) => (
              <TableRow key={visitor.id} onClick={() => onRowClick(visitor.id)} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <AvatarInitials name={visitor.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{visitor.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Host: {hostEntities[visitor.hostId]?.name ?? '—'}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">{visitor.visitType}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatTime(visitor.checkedInAt) ?? '—'}</TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{formatTime(visitor.checkedOutAt) ?? '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={getDisplayStatus(visitor, overstayMinutes)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {safePage * PAGE_SIZE + 1}–{Math.min((safePage + 1) * PAGE_SIZE, visitors.length)} of {visitors.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={safePage === 0} onClick={() => setPage((p) => p - 1)}>
            <FiChevronLeft className="size-3.5" /> Prev
          </Button>
          <span className="text-xs">Page {safePage + 1} of {pageCount}</span>
          <Button variant="outline" size="sm" disabled={safePage >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>
            Next <FiChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

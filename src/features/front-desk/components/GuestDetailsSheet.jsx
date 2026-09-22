import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FiCheckCircle, FiCircle, FiLoader, FiLogOut, FiChevronDown, FiSmartphone } from 'react-icons/fi'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { AvatarInitials } from '@/components/AvatarInitials'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDateTime, formatTime } from '@/lib/dateUtils'
import { getDisplayStatus } from '@/lib/statusTokens'
import { visitorSelectors, transitionVisitor, selectIsVisitorMutating } from '@/features/registration/visitorsSlice'
import { hostSelectors } from '@/features/approval/hostsSlice'
import { selectOverstayMinutes } from '@/features/admin/configSlice'
import { listAuditEvents } from '@/services/visitorService'
import { VisitorBadgeDialog } from './VisitorBadgeDialog'

// A badge only exists once the visitor is past the manual approval step (see
// assignment/problem-statement.md: "a visitor badge ... is generated after
// approval") — pending/rejected visitors never had one issued.
const HAS_BADGE_STATUSES = ['approved', 'checked-in', 'checked-out']

export function GuestDetailsSheet({ visitorId, open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
        {/* keyed by visitorId: switching guests remounts the body fresh (note/collapsible
            reset for free) instead of syncing state from a prop via an effect */}
        {visitorId && <GuestDetailsBody key={visitorId} visitorId={visitorId} />}
      </SheetContent>
    </Sheet>
  )
}

function GuestDetailsBody({ visitorId }) {
  const dispatch = useDispatch()
  const visitor = useSelector((s) => visitorSelectors.selectById(s, visitorId))
  const host = useSelector((s) => (visitor ? hostSelectors.selectById(s, visitor.hostId) : null))
  const overstayMinutes = useSelector(selectOverstayMinutes)
  const mutating = useSelector((s) => selectIsVisitorMutating(s, visitorId))
  const [events, setEvents] = useState([])
  const [note, setNote] = useState('')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [badgeOpen, setBadgeOpen] = useState(false)

  useEffect(() => {
    listAuditEvents(visitorId).then(setEvents)
  }, [visitorId])

  if (!visitor) return null
  const displayStatus = getDisplayStatus(visitor, overstayMinutes)

  const handleCheckOut = async () => {
    try {
      await dispatch(transitionVisitor({ id: visitor.id, to: 'checked-out' })).unwrap()
      toast.success(`${visitor.name} checked out`)
    } catch (message) {
      toast.error(message || 'Could not check out this visitor')
    }
  }

  return (
    <>
      <SheetHeader className="flex-row items-center justify-between space-y-0">
        <SheetTitle>Guest Details</SheetTitle>
        <StatusBadge status={displayStatus} className="mr-8" />
      </SheetHeader>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
        <div className="flex items-center justify-between gap-2 rounded-lg border border-border p-3">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <AvatarInitials name={visitor.name} size="lg" />
            <div>
              <p className="text-xs font-medium">{visitor.name}</p>
              <p className="text-[10px] text-muted-foreground">Guest</p>
            </div>
          </div>
          <span className="text-lg text-muted-foreground">↔</span>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <AvatarInitials name={host?.name ?? '?'} size="lg" />
            <div>
              <p className="text-xs font-medium">{host?.name ?? '—'}</p>
              <p className="text-[10px] text-muted-foreground">Host</p>
            </div>
          </div>
        </div>

        {HAS_BADGE_STATUSES.includes(visitor.status) && (
          <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setBadgeOpen(true)}>
            <FiSmartphone className="size-3.5" /> View Visitor Badge
          </Button>
        )}

        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm">
            <FiCheckCircle className={visitor.checkedInAt ? 'size-4 text-success' : 'size-4 text-muted-foreground'} />
            <span>Check-In {visitor.checkedInAt ? formatTime(visitor.checkedInAt) : '—'}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm">
            {visitor.checkedOutAt ? <FiCheckCircle className="size-4 text-success" /> : <FiCircle className="size-4 text-muted-foreground" />}
            <span>Check-Out {visitor.checkedOutAt ? formatTime(visitor.checkedOutAt) : '—'}</span>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium">{visitor.purpose}</p>
          <p className="text-xs text-muted-foreground">{visitor.visitType}</p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            className="flex w-full items-center justify-between text-left text-sm font-medium"
          >
            Other Details
            <FiChevronDown className={`size-4 text-muted-foreground transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
          </button>
          {detailsOpen && (
            <dl className="mt-2 space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between"><dt>Company</dt><dd className="text-foreground">{visitor.company ?? '—'}</dd></div>
              <div className="flex justify-between"><dt>Phone</dt><dd className="text-foreground">{visitor.phone}</dd></div>
              <div className="flex justify-between"><dt>Email</dt><dd className="text-foreground">{visitor.email ?? '—'}</dd></div>
              <div className="flex justify-between"><dt>Registered</dt><dd className="text-foreground">{formatDateTime(visitor.createdAt)}</dd></div>
            </dl>
          )}
        </div>

        {events.length > 0 && (
          <div>
            <p className="text-sm font-medium">Audit History</p>
            <ul className="mt-2 space-y-1.5">
              {events.map((e) => (
                <li key={e.id} className="flex items-center justify-between text-xs">
                  <StatusBadge status={e.action} />
                  <span className="text-muted-foreground">{formatDateTime(e.at)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-1.5">
          <p className="text-sm font-medium">Additional Information</p>
          <Textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 1000))} placeholder="Input text" rows={3} />
          <p className="text-right text-[10px] text-muted-foreground">{note.length}/1000</p>
        </div>
      </div>

      <div className="border-t border-border p-4">
        <Button
          className="btn-cta w-full"
          disabled={visitor.status !== 'checked-in' || mutating}
          onClick={handleCheckOut}
        >
          {mutating ? <FiLoader className="size-4 animate-spin" /> : <FiLogOut className="size-4" />}
          {visitor.status === 'checked-in' ? 'Check-Out' : 'Check-Out (not checked in)'}
        </Button>
      </div>

      <VisitorBadgeDialog visitor={visitor} host={host} open={badgeOpen} onOpenChange={setBadgeOpen} />
    </>
  )
}

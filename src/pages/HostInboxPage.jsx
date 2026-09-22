import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiInbox, FiClock } from 'react-icons/fi'
import { Card, CardContent } from '@/components/ui/card'
import { FlowBanner } from '@/components/FlowBanner'
import { StatusBadge } from '@/components/StatusBadge'
import { PendingVisitorCard } from '@/features/approval/components/PendingVisitorCard'
import { fetchVisitors, selectPendingForHost, selectVisitorsStatus } from '@/features/registration/visitorsSlice'
import { selectCurrentHostId } from '@/core/uiSlice'
import { hostSelectors } from '@/features/approval/hostsSlice'
import { listAuditEventsForHost } from '@/services/visitorService'
import { formatRelative } from '@/lib/dateUtils'

export default function HostInboxPage() {
  const dispatch = useDispatch()
  const hostId = useSelector(selectCurrentHostId)
  const host = useSelector((s) => (hostId ? hostSelectors.selectById(s, hostId) : null))
  const status = useSelector(selectVisitorsStatus)
  const pending = useSelector((s) => (hostId ? selectPendingForHost(s, hostId) : []))
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    dispatch(fetchVisitors())
  }, [dispatch])

  useEffect(() => {
    if (!hostId) return
    let cancelled = false
    listAuditEventsForHost(hostId).then((events) => {
      if (!cancelled) setRecentActivity(events)
    })
    return () => {
      cancelled = true
    }
    // re-fetch whenever the pending count changes (an action just happened)
  }, [hostId, pending.length])

  return (
    <div className="space-y-6">
      <FlowBanner
        flowKey="approvals"
        action={host && <p className="text-sm opacity-90">Acting as {host.name}</p>}
      />

      {/* Same-height columns on desktop, each scrolling its own overflow — see InvitesPage for the same pattern.
          Capped below lg too (max-h-*), not just lg:h-150, so a long list scrolls internally on every
          screen size instead of pushing the page into one long scroll. */}
      <div className="grid gap-6 lg:h-150 lg:grid-cols-3">
        <div className="flex max-h-125 flex-col gap-3 lg:col-span-2 lg:h-full lg:max-h-none">
          <h2 className="shrink-0 text-base font-semibold">
            Pending requests {status === 'idle' && <span className="text-muted-foreground">({pending.length})</span>}
          </h2>
          {!hostId ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Pick a host from the top bar to see their requests.
              </CardContent>
            </Card>
          ) : pending.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
                <FiInbox className="size-6 text-muted-foreground" />
                <p className="text-sm font-medium">All caught up</p>
                <p className="text-xs text-muted-foreground">No pending visitor requests right now.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto pr-1 lg:pb-1">
              {pending.map((visitor) => <PendingVisitorCard key={visitor.id} visitor={visitor} />)}
            </div>
          )}
        </div>

        <div className="flex max-h-125 flex-col gap-3 lg:h-full lg:max-h-none">
          <h2 className="shrink-0 text-base font-semibold">Recent activity</h2>
          <Card className="flex flex-1 flex-col overflow-hidden">
            <CardContent className="flex-1 overflow-y-auto pt-6">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              ) : (
                <ul className="space-y-4">
                  {recentActivity.map((event) => (
                    <li key={event.id} className="flex items-start gap-2.5 text-sm">
                      <FiClock className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="truncate">
                          <span className="font-medium">{event.visitorName}</span>{' '}
                          <StatusBadge status={event.action} className="ml-1 align-middle" />
                        </p>
                        <p className="text-xs text-muted-foreground">{formatRelative(event.at)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

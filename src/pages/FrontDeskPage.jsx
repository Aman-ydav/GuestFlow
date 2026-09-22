import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCamera } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { FlowBanner } from '@/components/FlowBanner'
import { VisitorFilters } from '@/features/front-desk/components/VisitorFilters'
import { VisitorTable } from '@/features/front-desk/components/VisitorTable'
import { GuestDetailsSheet } from '@/features/front-desk/components/GuestDetailsSheet'
import { QrCheckInScanner } from '@/features/front-desk/components/QrCheckInScanner'
import {
  fetchVisitors,
  selectVisibleVisitors,
  visitorSelectors,
  selectVisitorsStatus,
} from '@/features/registration/visitorsSlice'
import { fetchHosts } from '@/features/approval/hostsSlice'
import { fetchConfig, selectOverstayMinutes } from '@/features/admin/configSlice'
import { selectSelectedVisitorId, visitorSelected } from '@/core/uiSlice'
import { getDisplayStatus } from '@/lib/statusTokens'

export default function FrontDeskPage() {
  const dispatch = useDispatch()
  const status = useSelector(selectVisitorsStatus)
  const visitors = useSelector(selectVisibleVisitors)
  const allVisitors = useSelector(visitorSelectors.selectAll)
  const overstayMinutes = useSelector(selectOverstayMinutes)
  const selectedVisitorId = useSelector(selectSelectedVisitorId)
  const [scannerOpen, setScannerOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchVisitors())
    dispatch(fetchHosts())
    dispatch(fetchConfig())
  }, [dispatch])

  const overstayCount = allVisitors.filter((v) => getDisplayStatus(v, overstayMinutes) === 'overstay').length

  return (
    <div className="space-y-6">
      <FlowBanner
        flowKey="frontDesk"
        action={
          <div className="flex gap-4 text-sm">
            <span>{allVisitors.length} total</span>
            {overstayCount > 0 && <span className="font-semibold">{overstayCount} overstay</span>}
          </div>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <VisitorFilters />
        <Button type="button" variant="outline" size="sm" className="shrink-0" onClick={() => setScannerOpen(true)}>
          <FiCamera className="size-3.5" /> Scan QR
        </Button>
      </div>

      {status === 'loading' ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading visitors…</p>
      ) : (
        <VisitorTable visitors={visitors} onRowClick={(id) => dispatch(visitorSelected(id))} />
      )}

      <GuestDetailsSheet
        visitorId={selectedVisitorId}
        open={!!selectedVisitorId}
        onOpenChange={(open) => !open && dispatch(visitorSelected(null))}
      />

      <QrCheckInScanner open={scannerOpen} onOpenChange={setScannerOpen} />
    </div>
  )
}

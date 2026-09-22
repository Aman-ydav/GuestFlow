import { useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { FiCalendar, FiMapPin, FiSmartphone, FiXCircle, FiUsers } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDateTime } from '@/lib/dateUtils'
import { cancelInvite } from '../invitesSlice'

export function InviteListItem({ invite, officeName, onViewPass }) {
  const dispatch = useDispatch()

  const handleCancel = async () => {
    try {
      await dispatch(cancelInvite(invite.id)).unwrap()
      toast.success(`Invite ${invite.code} cancelled`)
    } catch (message) {
      toast.error(message || 'Could not cancel this invite')
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{invite.title}</p>
            <StatusBadge status={invite.status} />
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><FiCalendar className="size-3" /> {formatDateTime(invite.windowStart)}</span>
            <span className="flex items-center gap-1"><FiMapPin className="size-3" /> {officeName ?? '—'}</span>
            <span className="flex items-center gap-1"><FiUsers className="size-3" /> {invite.guestIds.length} guest(s)</span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => onViewPass(invite)}>
            <FiSmartphone className="size-3.5" /> E-Pass
          </Button>
          {invite.status === 'invited' && (
            <Button type="button" size="sm" variant="outline" onClick={handleCancel} className="text-destructive hover:bg-destructive/10">
              <FiXCircle className="size-3.5" /> Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

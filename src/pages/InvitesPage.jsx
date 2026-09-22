import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from '@/components/ui/card'
import { FlowBanner } from '@/components/FlowBanner'
import { InviteForm } from '@/features/invites/components/InviteForm'
import { InviteListItem } from '@/features/invites/components/InviteListItem'
import { EPassDialog } from '@/features/invites/components/EPassDialog'
import { fetchInvites, selectInvitesForHost } from '@/features/invites/invitesSlice'
import { selectCurrentHostId } from '@/core/uiSlice'
import { fetchConfig, selectConfig } from '@/features/admin/configSlice'

export default function InvitesPage() {
  const dispatch = useDispatch()
  const hostId = useSelector(selectCurrentHostId)
  const invites = useSelector((s) => (hostId ? selectInvitesForHost(s, hostId) : []))
  const config = useSelector(selectConfig)
  const [activePass, setActivePass] = useState(null)

  useEffect(() => {
    dispatch(fetchInvites())
    if (!config.offices?.length) dispatch(fetchConfig())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const officeName = (officeId) => config.offices?.find((o) => o.id === officeId)?.name

  return (
    <div className="space-y-6">
      <FlowBanner flowKey="invites" />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-base font-semibold">New Invite</h2>
              <InviteForm />
              <p className="mt-3 text-xs text-muted-foreground">
                Max {config.preApprovalLimit} active invites per host per day — enforced automatically.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3 lg:col-span-3">
          <h2 className="text-base font-semibold">Your invites {invites.length > 0 && `(${invites.length})`}</h2>
          {!hostId ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Pick a host from the top bar to see their invites.
              </CardContent>
            </Card>
          ) : invites.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                No invites yet — create one on the left.
              </CardContent>
            </Card>
          ) : (
            invites.map((invite) => (
              <InviteListItem key={invite.id} invite={invite} officeName={officeName(invite.officeId)} onViewPass={setActivePass} />
            ))
          )}
        </div>
      </div>

      <EPassDialog invite={activePass} open={!!activePass} onOpenChange={(open) => !open && setActivePass(null)} />
    </div>
  )
}

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

      {/* Both columns are the same height on desktop (lg:h-150) and each scrolls its own
          overflow internally, so a long invite list never stretches the row unevenly
          against the form — see Aman's "make the height of the cards in one row the same"
          note. The invite list is also height-capped below lg (max-h-125) for the same
          reason: a long list scrolls in place instead of pushing the page down. */}
      <div className="grid gap-6 lg:h-150 lg:grid-cols-5">
        <Card className="flex flex-col lg:col-span-2 lg:h-full">
          <CardContent className="flex-1 overflow-y-auto pt-6">
            <h2 className="mb-4 text-base font-semibold">New Invite</h2>
            <InviteForm />
            <p className="mt-3 text-xs text-muted-foreground">
              Max {config.preApprovalLimit} active invites per host per day — enforced automatically.
            </p>
          </CardContent>
        </Card>

        <div className="flex max-h-125 flex-col gap-3 lg:col-span-3 lg:h-full lg:max-h-none">
          <h2 className="shrink-0 text-base font-semibold">Your invites {invites.length > 0 && `(${invites.length})`}</h2>
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
            <div className="flex-1 space-y-3 overflow-y-auto pr-1 lg:pb-1">
              {invites.map((invite) => (
                <InviteListItem key={invite.id} invite={invite} officeName={officeName(invite.officeId)} onViewPass={setActivePass} />
              ))}
            </div>
          )}
        </div>
      </div>

      <EPassDialog invite={activePass} open={!!activePass} onOpenChange={(open) => !open && setActivePass(null)} />
    </div>
  )
}

import QRCode from 'react-qr-code'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/StatusBadge'

/**
 * The visitor badge generated once a walk-in registration is approved (see
 * assignment/problem-statement.md: "a visitor badge (physical or digital QR
 * code) is generated after approval"). Same visual pattern as the invite
 * flow's EPassDialog (features/invites) — pure SVG QR, no gradients — but
 * keyed off the visitor's own id rather than an invite code, since a walk-in
 * was never issued one.
 */
export function VisitorBadgeDialog({ visitor, host, open, onOpenChange }) {
  if (!visitor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Visitor Badge</DialogTitle>
          <DialogDescription>Show this at the front desk or exit gate — it identifies {visitor.name}'s visit.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCode value={visitor.id} size={176} fgColor="#14213A" bgColor="#FFFFFF" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{visitor.name}</p>
            <p className="text-xs text-muted-foreground">Visiting {host?.name ?? '—'}</p>
          </div>
          <StatusBadge status={visitor.status} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

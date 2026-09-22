import QRCode from 'react-qr-code'
import { FiPrinter } from 'react-icons/fi'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'

/**
 * The visitor badge generated once a walk-in registration is approved (see
 * assignment/problem-statement.md: "a visitor badge (physical or digital QR
 * code) is generated after approval"). Same visual pattern as the invite
 * flow's EPassDialog (features/invites) — pure SVG QR, no gradients — but
 * keyed off the visitor's own id rather than an invite code, since a walk-in
 * was never issued one. That same id is what the front desk's QR scanner
 * (QrCheckInScanner) decodes to look the visitor back up.
 */
export function VisitorBadgeDialog({ visitor, host, open, onOpenChange }) {
  if (!visitor) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="no-print">
          <DialogTitle>Visitor Badge</DialogTitle>
          <DialogDescription>Show this at the front desk or exit gate — it identifies {visitor.name}'s visit.</DialogDescription>
        </DialogHeader>
        <div className="print-pass flex flex-col items-center gap-4 py-2">
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCode value={visitor.id} size={176} fgColor="#14213A" bgColor="#FFFFFF" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold">{visitor.name}</p>
            <p className="text-xs text-muted-foreground">Visiting {host?.name ?? '—'}</p>
          </div>
          <StatusBadge status={visitor.status} />
        </div>
        <DialogFooter className="no-print">
          <Button type="button" variant="outline" className="w-full" onClick={() => window.print()}>
            <FiPrinter className="size-3.5" /> Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

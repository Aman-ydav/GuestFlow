import QRCode from 'react-qr-code'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { StatusBadge } from '@/components/StatusBadge'
import { formatDateTime } from '@/lib/dateUtils'

/** The visitor's QR e-pass — scanned at the kiosk to bypass manual approval
 * (see docs/requirements.md §III). Pure SVG, no gradients, themeable. */
export function EPassDialog({ invite, open, onOpenChange }) {
  if (!invite) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{invite.title}</DialogTitle>
          <DialogDescription>Guest scans this at the kiosk to check in instantly.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="rounded-xl border border-border bg-white p-4">
            <QRCode value={invite.code} size={176} fgColor="#14213A" bgColor="#FFFFFF" />
          </div>
          <p className="font-mono text-sm font-semibold tracking-widest">{invite.code}</p>
          <StatusBadge status={invite.status} />
          <div className="w-full space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <p>Valid: {formatDateTime(invite.windowStart)} → {formatDateTime(invite.windowEnd)}</p>
            <p>Expires automatically if not used within this window.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

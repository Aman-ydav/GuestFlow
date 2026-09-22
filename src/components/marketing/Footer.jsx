import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { FitText } from './FitText'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="site-container py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Guest<span className="text-primary">Flow</span>
            </span>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">
              A case-study visitor management system — registration, host approvals, pre-approved invites, and a
              front-desk dashboard, built for the MoveInSync frontend intern assignment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Product</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li><Link to={ROUTES.KIOSK} className="text-foreground/80 hover:text-primary">Kiosk</Link></li>
                <li><Link to={ROUTES.HOST_INBOX} className="text-foreground/80 hover:text-primary">Host Inbox</Link></li>
                <li><Link to={ROUTES.INVITES} className="text-foreground/80 hover:text-primary">Invites</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Operations</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li><Link to={ROUTES.FRONT_DESK} className="text-foreground/80 hover:text-primary">Front Desk</Link></li>
                <li><Link to={ROUTES.ADMIN} className="text-foreground/80 hover:text-primary">Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Big wordmark flourish — genuinely fills the full container width via FitText
          (a vw-based font-size either overflows or falls short depending on word length). */}
      <div className="site-container overflow-hidden pb-4">
        <FitText textClassName="text-6xl font-black tracking-tighter text-foreground/[0.06] select-none" className="w-full">
          GuestFlow
        </FitText>
      </div>
    </footer>
  )
}

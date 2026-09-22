import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                G
              </span>
              <span className="text-base font-semibold">GuestFlow</span>
            </div>
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
        <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} GuestFlow. Built as a case-study submission — not a commercial product.
        </p>
      </div>
    </footer>
  )
}

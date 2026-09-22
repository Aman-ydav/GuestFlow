import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

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
        <p className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} GuestFlow. Built as a case-study submission — not a commercial product.
        </p>
      </div>

      {/* Big wordmark flourish */}
      <div className="site-container overflow-hidden pb-6">
        <p
          aria-hidden="true"
          className="-mb-3 -ml-1 truncate text-[16vw] leading-none font-black tracking-tighter text-foreground/5 select-none sm:text-[12vw] lg:text-[9rem]"
        >
          GuestFlow
        </p>
      </div>
    </footer>
  )
}

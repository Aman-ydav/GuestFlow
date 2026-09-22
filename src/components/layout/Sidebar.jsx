import { Link, NavLink } from 'react-router-dom'
import { FiGrid, FiInbox, FiMail, FiMonitor, FiSettings } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'

const NAV_ITEMS = [
  { to: ROUTES.KIOSK, label: 'Kiosk', icon: FiGrid, roles: [ROLES.VISITOR, ROLES.ADMIN] },
  { to: ROUTES.HOST_INBOX, label: 'Host Inbox', icon: FiInbox, roles: [ROLES.HOST, ROLES.ADMIN] },
  { to: ROUTES.INVITES, label: 'Invites', icon: FiMail, roles: [ROLES.HOST, ROLES.ADMIN] },
  { to: ROUTES.FRONT_DESK, label: 'Front Desk', icon: FiMonitor, roles: [ROLES.FRONT_DESK, ROLES.ADMIN] },
  { to: ROUTES.ADMIN, label: 'Admin', icon: FiSettings, roles: [ROLES.ADMIN] },
]

export function Sidebar({ role }) {
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:flex md:flex-col">
      <Link to={ROUTES.HOME} className="flex h-14 items-center gap-2 border-b border-border px-4">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
          G
        </span>
        <span className="text-base font-semibold">GuestFlow</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

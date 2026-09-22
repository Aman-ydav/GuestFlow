import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'
import { FLOWS } from '@/lib/flowTheme'
import { selectSidebarCollapsed, sidebarToggled } from '@/core/uiSlice'

const NAV_ITEMS = [
  { flow: FLOWS.registration, roles: [ROLES.VISITOR, ROLES.ADMIN] },
  { flow: FLOWS.approvals, roles: [ROLES.HOST, ROLES.ADMIN] },
  { flow: FLOWS.invites, roles: [ROLES.HOST, ROLES.ADMIN] },
  { flow: FLOWS.frontDesk, roles: [ROLES.FRONT_DESK, ROLES.ADMIN] },
  { flow: FLOWS.admin, roles: [ROLES.ADMIN] },
]

export function Sidebar({ role }) {
  const dispatch = useDispatch()
  const collapsed = useSelector(selectSidebarCollapsed)
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300 ease-in-out md:flex',
        collapsed ? 'w-19' : 'w-64'
      )}
    >
      <div className={cn('flex h-16 items-center border-b border-border', collapsed ? 'justify-center px-2' : 'justify-between px-5')}>
        {!collapsed && (
          <Link to={ROUTES.HOME} className="text-lg font-bold tracking-tight text-foreground">
            Guest<span className="text-primary">Flow</span>
          </Link>
        )}
        <button
          type="button"
          onClick={() => dispatch(sidebarToggled())}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {collapsed ? <FiChevronsRight className="size-4" /> : <FiChevronsLeft className="size-4" />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
        {items.map(({ flow }) => (
          <NavLink
            key={flow.to}
            to={flow.to}
            end={flow.to === ROUTES.FRONT_DESK}
            aria-label={collapsed ? flow.title : undefined}
            title={collapsed ? flow.title : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? cn(flow.tone, 'shadow-sm')
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <flow.icon className="size-4.5 shrink-0" />
            {!collapsed && <span className="truncate">{flow.title}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/routes'
import { ROLES } from '@/constants/roles'
import { FLOWS } from '@/lib/flowTheme'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
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
  const { pathname } = useLocation()
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <TooltipProvider delayDuration={300}>
      <aside
        className={cn(
          'relative hidden shrink-0 flex-col border-r border-border bg-card transition-[width] duration-300 ease-in-out md:flex',
          collapsed ? 'w-19' : 'w-64'
        )}
      >
        <div className={cn('flex h-16 items-center border-b border-border', collapsed ? 'justify-center px-2' : 'px-5')}>
          <Link to={ROUTES.HOME} className="flex shrink-0 items-center" aria-label="GuestFlow">
            {collapsed ? (
              <img src="/logo-icon.png" alt="" className="size-7" />
            ) : (
              <img src="/full-logo.png" alt="" className="h-7 w-auto" />
            )}
          </Link>
        </div>

        {/* Collapse/expand handle — a hover-highlighted line on the sidebar's edge with
            a resize-style cursor, instead of a chevron button. The button used to sit next
            to the logo in the collapsed header, which didn't leave the logo enough room to
            read clearly at w-19; a full-height edge handle needs no header space at all. A
            shadcn Tooltip spells out "click to expand/collapse" on hover — a plain color
            highlight alone didn't make it obvious the line was clickable. */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => dispatch(sidebarToggled())}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="absolute inset-y-0 -right-px z-10 w-1.5 cursor-col-resize bg-transparent transition-colors hover:bg-primary/40 focus-visible:bg-primary/60 focus-visible:outline-none"
            />
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? 'Click to expand sidebar' : 'Click to collapse sidebar'}
          </TooltipContent>
        </Tooltip>

        <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-3">
          {items.map(({ flow }) => {
            const end = flow.to === ROUTES.FRONT_DESK
            const isActive = end ? pathname === flow.to : pathname.startsWith(flow.to)
            // A plain string, not a function — NavLink normally accepts a
            // ({isActive}) => string function for className, but Radix Slot
            // (from TooltipTrigger asChild below) merges className by string
            // concatenation, which silently stringifies a function prop via JS's
            // usual `+` coercion. That put the function's literal *source code*
            // into the class attribute instead of the computed classes — `flex`
            // never actually applied, so this was never really a flex row. Caught
            // by rendering it in a test and reading the real outerHTML, not by
            // guessing from the JSX. Computing isActive here avoids the function
            // entirely.
            const linkClassName = cn(
              'flex flex-nowrap items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
              collapsed && 'justify-center px-0',
              isActive
                ? cn(flow.tone, 'shadow-sm')
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )
            return (
              <Tooltip key={flow.to}>
                <TooltipTrigger asChild>
                  <NavLink to={flow.to} end={end} aria-label={collapsed ? flow.title : undefined} className={linkClassName}>
                    <flow.icon className="size-4 shrink-0" />
                    {!collapsed && <span className="truncate">{flow.title}</span>}
                  </NavLink>
                </TooltipTrigger>
                {/* Only when collapsed — expanded nav already shows the label as text. */}
                {collapsed && <TooltipContent side="right">{flow.title}</TooltipContent>}
              </Tooltip>
            )
          })}
        </nav>
      </aside>
    </TooltipProvider>
  )
}

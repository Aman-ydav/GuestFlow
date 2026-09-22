import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiMenu } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ROUTES } from '@/constants/routes'
import { FLOWS } from '@/lib/flowTheme'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { flow: FLOWS.registration, roles: ['visitor', 'admin'] },
  { flow: FLOWS.approvals, roles: ['host', 'admin'] },
  { flow: FLOWS.invites, roles: ['host', 'admin'] },
  { flow: FLOWS.frontDesk, roles: ['front-desk', 'admin'] },
  { flow: FLOWS.admin, roles: ['admin'] },
]

/** Sidebar's mobile equivalent — the desktop sidebar is `hidden md:flex`,
 * so below md this Sheet-based hamburger is the only way to switch flows. */
export function MobileNav({ role }) {
  const [open, setOpen] = useState(false)
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <>
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" onClick={() => setOpen(true)}>
        <FiMenu className="size-5" />
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle asChild>
              <Link to={ROUTES.HOME} onClick={() => setOpen(false)} className="text-lg font-bold tracking-tight text-foreground">
                Guest<span className="text-primary">Flow</span>
              </Link>
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1.5 px-4">
            {items.map(({ flow }) => (
              <NavLink
                key={flow.to}
                to={flow.to}
                end={flow.to === ROUTES.FRONT_DESK}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors',
                    isActive ? cn(flow.tone, 'shadow-sm') : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )
                }
              >
                <flow.icon className="size-4.5 shrink-0" />
                {flow.title}
              </NavLink>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  )
}

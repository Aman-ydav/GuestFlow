import { Link } from 'react-router-dom'
import { FiSearch, FiHelpCircle, FiLogIn } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/lib/utils'

const SOLUTIONS = [
  { to: ROUTES.KIOSK, title: 'Visitor Registration', desc: 'Kiosk check-in with mandatory photo capture' },
  { to: ROUTES.HOST_INBOX, title: 'Host Approvals', desc: 'Approve or reject requests in real time' },
  { to: ROUTES.INVITES, title: 'Pre-Approved Invites', desc: 'QR e-passes with auto-expiry and daily limits' },
  { to: ROUTES.FRONT_DESK, title: 'Front Desk Dashboard', desc: 'Live visitor log, search, and overstay alerts' },
]

/** White (light-theme) navbar styled after the reference mood — logo, dropdown
 * nav, and a pill CTA — but every link is real and goes into the working app,
 * not a fake marketing form. */
export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            G
          </span>
          <span className="text-base font-semibold tracking-tight">GuestFlow</span>
        </Link>

        <NavigationMenu viewport={false} className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-sm font-medium">
                <Link to={ROUTES.HOME}>Product</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium text-brand-teal">Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-90 gap-1 p-2">
                  {SOLUTIONS.map((item) => (
                    <li key={item.to}>
                      <NavigationMenuLink asChild>
                        <Link to={item.to} className="block rounded-md p-2.5 hover:bg-accent">
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-sm font-medium">
                <Link to={ROUTES.ADMIN}>Enterprise</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="text-sm font-medium">
                <Link to={ROUTES.ADMIN}>Docs</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Search">
            <FiSearch className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Support">
            <FiHelpCircle className="size-4" />
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to={ROUTES.FRONT_DESK}>
              <FiLogIn className="size-4" /> Login
            </Link>
          </Button>
          <Button asChild size="sm" className={cn('btn-cta bg-brand-lime text-brand-lime-foreground hover:bg-brand-lime/90')}>
            <Link to={ROUTES.FRONT_DESK}>View Live Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

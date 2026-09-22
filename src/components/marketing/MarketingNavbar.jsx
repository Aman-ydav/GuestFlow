import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiMenu } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ROUTES } from '@/constants/routes'
import { FLOW_LIST } from '@/lib/flowTheme'
import { cn } from '@/lib/utils'

// Full lockup on spacious headers, icon-only mark once space gets tight (below sm).
const WORDMARK = (
  <>
    <img src="/full-logo.png" alt="GuestFlow" className="hidden h-7 w-auto sm:block" />
    <img src="/logo-icon.png" alt="GuestFlow" className="h-8 w-auto sm:hidden" />
  </>
)

/** Light navbar styled after the reference mood — real logo lockup, dropdown nav,
 * and a pill CTA — every link is real and goes into the working app. Below md:
 * the nav collapses into a Sheet-based hamburger menu. */
export function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="site-container flex h-16 items-center justify-between">
        <Link to={ROUTES.HOME}>{WORDMARK}</Link>

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
                  {FLOW_LIST.map((item) => (
                    <li key={item.to}>
                      <NavigationMenuLink asChild>
                        <Link to={item.to} className="flex items-start gap-2.5 rounded-md p-2.5 hover:bg-accent">
                          <span className={cn('mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md', item.tone)}>
                            <item.icon className="size-3.5" />
                          </span>
                          <span>
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </span>
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
          <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
            <Link to={ROUTES.LOGIN}>Login</Link>
          </Button>
          <Button asChild size="sm" className="btn-cta hidden bg-brand-lime text-brand-lime-foreground hover:bg-brand-lime/90 sm:inline-flex">
            <Link to={ROUTES.FRONT_DESK}>View Live Demo</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu className="size-5" />
          </Button>
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-72">
          <SheetHeader>
            <SheetTitle asChild>
              <img src="/full-logo.png" alt="GuestFlow" className="h-7 w-auto" />
            </SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4">
            <Link to={ROUTES.HOME} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent">
              Product
            </Link>
            <p className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Solutions</p>
            {FLOW_LIST.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent"
              >
                <span className={cn('flex size-6 shrink-0 items-center justify-center rounded-md', item.tone)}>
                  <item.icon className="size-3.5" />
                </span>
                {item.title}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
            <Button variant="outline" asChild>
              <Link to={ROUTES.LOGIN} onClick={() => setMobileOpen(false)}>Login</Link>
            </Button>
            <Button asChild className="btn-cta bg-brand-lime text-brand-lime-foreground hover:bg-brand-lime/90">
              <Link to={ROUTES.FRONT_DESK} onClick={() => setMobileOpen(false)}>View Live Demo</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}

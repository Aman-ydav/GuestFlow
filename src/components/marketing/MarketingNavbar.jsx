import { Link } from 'react-router-dom'
import { FiSearch, FiLogIn } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ROUTES } from '@/constants/routes'
import { FLOW_LIST } from '@/lib/flowTheme'
import { cn } from '@/lib/utils'

/** Light navbar styled after the reference mood — clean wordmark (no icon badge),
 * dropdown nav, and a pill CTA — every link is real and goes into the working app. */
export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="site-container flex h-16 items-center justify-between">
        <Link to={ROUTES.HOME} className="text-lg font-bold tracking-tight text-foreground">
          Guest<span className="text-primary">Flow</span>
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
            <Link to={ROUTES.FRONT_DESK}>
              <FiLogIn className="size-4" /> Login
            </Link>
          </Button>
          <Button asChild size="sm" className="btn-cta bg-brand-lime text-brand-lime-foreground hover:bg-brand-lime/90">
            <Link to={ROUTES.FRONT_DESK}>View Live Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

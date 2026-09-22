import { Outlet, useMatches } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { selectRole, selectTheme } from '@/core/uiSlice'
import { cn } from '@/lib/utils'

export function AppShell() {
  const role = useSelector(selectRole)
  const theme = useSelector(selectTheme)
  const matches = useMatches()
  const title = matches.findLast((m) => m.handle?.title)?.handle?.title ?? 'GuestFlow'

  return (
    // `dark` is applied HERE, not on <html> — this is an SPA, and the marketing
    // route (/) is a sibling tree that's never inside this div, so it can never
    // inherit dark mode by navigating. See hooks/useTheme.js.
    <div className={cn('flex h-screen w-full overflow-hidden bg-background text-foreground', theme === 'dark' && 'dark')}>
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster theme={theme} position="top-right" />
    </div>
  )
}

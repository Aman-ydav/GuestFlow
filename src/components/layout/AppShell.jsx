import { Outlet, useMatches } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Toaster } from '@/components/ui/sonner'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { selectRole } from '@/core/uiSlice'

export function AppShell() {
  const role = useSelector(selectRole)
  const matches = useMatches()
  const title = matches.findLast((m) => m.handle?.title)?.handle?.title ?? 'GuestFlow'

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar role={role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

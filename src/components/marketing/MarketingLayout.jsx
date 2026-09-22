import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { MarketingNavbar } from './MarketingNavbar'
import { Footer } from './Footer'

export function MarketingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  )
}

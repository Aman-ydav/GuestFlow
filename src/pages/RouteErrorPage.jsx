import { useRouteError, Link, useNavigate } from 'react-router-dom'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <FiAlertTriangle className="size-8" />
      </span>
      <div>
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {error?.statusText || error?.message || 'An unexpected error occurred loading this screen.'}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => navigate(0)}>
          <FiRefreshCw className="size-4" /> Try again
        </Button>
        <Button asChild className="btn-cta">
          <Link to={ROUTES.HOME}>Back to GuestFlow</Link>
        </Button>
      </div>
    </div>
  )
}

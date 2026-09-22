import { useRouteError } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'

export default function RouteErrorPage() {
  const error = useRouteError()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background p-6 text-center text-foreground">
      <FiAlertTriangle className="size-10 text-destructive" />
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        {error?.statusText || error?.message || 'An unexpected error occurred.'}
      </p>
    </div>
  )
}

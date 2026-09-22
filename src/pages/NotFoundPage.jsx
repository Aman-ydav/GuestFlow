import { Link } from 'react-router-dom'
import { FiAlertCircle } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <FiAlertCircle className="size-10 text-muted-foreground" />
      <div>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
      </div>
      <Button asChild className="btn-cta">
        <Link to={ROUTES.HOME}>Back to GuestFlow</Link>
      </Button>
    </div>
  )
}

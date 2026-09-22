import { Link } from 'react-router-dom'
import { FiCompass, FiArrowRight } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import { FLOW_LIST } from '@/lib/flowTheme'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-6 py-16 text-center text-foreground">
      <div className="flex flex-col items-center gap-4">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FiCompass className="size-8" />
        </span>
        <div>
          <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase">404</p>
          <h1 className="mt-1 text-2xl font-bold">This page doesn't exist</h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            The link might be broken, or the page may have moved. Here's where you probably meant to go:
          </p>
        </div>
        <Button asChild className="btn-cta">
          <Link to={ROUTES.HOME}>
            Back to GuestFlow <FiArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {FLOW_LIST.map(({ to, title, icon: Icon, tone }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-4 text-center transition-transform hover:-translate-y-0.5 hover:shadow-sm"
          >
            <span className={`flex size-9 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="size-4" />
            </span>
            <span className="text-xs font-medium text-foreground">{title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

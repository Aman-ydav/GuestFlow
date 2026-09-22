import { Badge } from '@/components/ui/badge'
import { getStatusToken } from '@/lib/statusTokens'
import { cn } from '@/lib/utils'

/** The one place a visitor/invite status becomes a colored badge. Never hardcode a status color elsewhere. */
export function StatusBadge({ status, className }) {
  const { label, className: tokenClassName } = getStatusToken(status)
  return (
    <Badge variant="outline" className={cn('border-transparent font-medium', tokenClassName, className)}>
      {label}
    </Badge>
  )
}

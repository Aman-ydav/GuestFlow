import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FiCheck, FiX, FiLoader } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AvatarInitials } from '@/components/AvatarInitials'
import { formatRelative } from '@/lib/dateUtils'
import { transitionVisitor, selectIsVisitorMutating } from '../../registration/visitorsSlice'

export function PendingVisitorCard({ visitor }) {
  const dispatch = useDispatch()
  const mutating = useSelector((s) => selectIsVisitorMutating(s, visitor.id))

  const act = async (to, verb) => {
    try {
      await dispatch(transitionVisitor({ id: visitor.id, to })).unwrap()
      toast.success(`${visitor.name} ${verb}`)
    } catch (message) {
      toast.error(message || `Could not ${verb.replace('ed', '')} ${visitor.name}`)
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AvatarInitials name={visitor.name} size="lg" />
          <div>
            <p className="text-sm font-semibold">{visitor.name}</p>
            <p className="text-xs text-muted-foreground">
              {visitor.purpose} {visitor.company && `· ${visitor.company}`}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">Requested {formatRelative(visitor.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={mutating}
            onClick={() => act('rejected', 'rejected')}
            className="border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            {mutating ? <FiLoader className="size-3.5 animate-spin" /> : <FiX className="size-3.5" />} Reject
          </Button>
          <Button type="button" size="sm" disabled={mutating} onClick={() => act('approved', 'approved')}>
            {mutating ? <FiLoader className="size-3.5 animate-spin" /> : <FiCheck className="size-3.5" />} Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

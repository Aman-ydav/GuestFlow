import { useDispatch, useSelector } from 'react-redux'
import { FiUser } from 'react-icons/fi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { roleChanged, selectRole } from '@/core/uiSlice'
import { ROLE_LABELS, ALL_ROLES } from '@/constants/roles'

/**
 * Demo-only role switcher — there is no real auth in this build (see
 * docs/01-architecture-and-data.md). Clearly labelled so it's never mistaken
 * for a security boundary.
 */
export function RoleSwitcher() {
  const role = useSelector(selectRole)
  const dispatch = useDispatch()

  return (
    <Select value={role} onValueChange={(next) => dispatch(roleChanged(next))}>
      <SelectTrigger className="w-[160px]" aria-label="Switch role (demo only)">
        <FiUser className="size-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ALL_ROLES.map((r) => (
          <SelectItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

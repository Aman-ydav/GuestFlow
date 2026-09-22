import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiBriefcase } from 'react-icons/fi'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { roleChanged, currentHostChanged, selectRole, selectCurrentHostId } from '@/core/uiSlice'
import { fetchHosts, hostSelectors } from '@/features/approval/hostsSlice'
import { ROLE_LABELS, ALL_ROLES, ROLE_LANDING } from '@/constants/roles'

/**
 * Demo-only role switcher — there is no real auth in this build (see
 * docs/01-architecture-and-data.md). Clearly labelled so it's never mistaken
 * for a security boundary. For 'host'/'admin' roles, a second select picks
 * WHICH mock host you're acting as — Host Inbox and Invites scope to it.
 */
export function RoleSwitcher() {
  const role = useSelector(selectRole)
  const currentHostId = useSelector(selectCurrentHostId)
  const hosts = useSelector(hostSelectors.selectAll)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (hosts.length === 0) dispatch(fetchHosts())
  }, [dispatch, hosts.length])

  useEffect(() => {
    if ((role === 'host' || role === 'admin') && !currentHostId && hosts.length > 0) {
      dispatch(currentHostChanged(hosts[0].id))
    }
  }, [role, currentHostId, hosts, dispatch])

  // The page you were on for the old role may not make sense for the new one
  // (e.g. an Admin on /app/admin switching to Host) — land on the new role's
  // own home screen instead of leaving the URL where it was.
  const handleRoleChange = (next) => {
    dispatch(roleChanged(next))
    navigate(ROLE_LANDING[next])
  }

  const showHostPicker = role === 'host' || role === 'admin'

  return (
    <div className="flex items-center gap-2">
      {showHostPicker && (
        <Select value={currentHostId ?? ''} onValueChange={(next) => dispatch(currentHostChanged(next))}>
          <SelectTrigger className="hidden w-48 sm:flex" aria-label="Acting as host (demo only)">
            <FiBriefcase className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Choose a host" />
          </SelectTrigger>
          <SelectContent>
            {hosts.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.name} — {h.department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <Select value={role} onValueChange={handleRoleChange}>
        <SelectTrigger className="w-40" aria-label="Switch role (demo only)">
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
    </div>
  )
}

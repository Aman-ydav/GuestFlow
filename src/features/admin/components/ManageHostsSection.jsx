import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FiLoader, FiPlus, FiX } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { AvatarInitials } from '@/components/AvatarInitials'
import {
  fetchHosts,
  createHost,
  deleteHost,
  hostSelectors,
  selectIsHostMutating,
} from '@/features/approval/hostsSlice'
import { required, isEmail, composeValidators, validate } from '@/lib/validators'

const RULES = {
  name: required('Name'),
  department: required('Department'),
  email: composeValidators(required('Email'), isEmail),
}
const INITIAL = { name: '', department: '', email: '' }

/**
 * Admin's only path for provisioning host employees — before this, the only
 * hosts anyone could pick (in registration, invites, role switching) were
 * whatever the mock seed generated, with no way to add or remove one. Same
 * list-plus-inline-add pattern as the Offices section above it.
 */
export function ManageHostsSection() {
  const dispatch = useDispatch()
  const hosts = useSelector(hostSelectors.selectAll)
  const status = useSelector((s) => s.hosts.status)
  const [values, setValues] = useState(INITIAL)
  const [touched, setTouched] = useState({})
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (hosts.length === 0) dispatch(fetchHosts())
  }, [dispatch, hosts.length])

  const errors = validate(values, RULES)
  const showError = (field) => touched[field] && errors[field]
  const set = (field) => (e) => setValues((v) => ({ ...v, [field]: e.target.value }))

  const handleAdd = async (e) => {
    e.preventDefault()
    setTouched({ name: true, department: true, email: true })
    if (Object.keys(errors).length > 0) return
    setAdding(true)
    try {
      await dispatch(createHost(values)).unwrap()
      toast.success(`${values.name} added as a host`)
      setValues(INITIAL)
      setTouched({})
    } catch (message) {
      toast.error(message || 'Could not add host')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Label>Hosts (Employees)</Label>
        <p className="mt-1 text-xs text-muted-foreground">
          Employees who can be visited — appear in the host picker for registration, approvals, and invites.
        </p>
        <Separator className="my-4" />

        {status === 'loading' && hosts.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">Loading hosts…</p>
        ) : (
          <ul className="max-h-72 space-y-2 overflow-y-auto">
            {hosts.map((host) => (
              <HostRow key={host.id} host={host} />
            ))}
          </ul>
        )}

        <form onSubmit={handleAdd} className="mt-4 space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="space-y-1">
              <Input placeholder="Full name" value={values.name} onChange={set('name')} aria-invalid={!!showError('name')} />
              {showError('name') && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1">
              <Input placeholder="Department" value={values.department} onChange={set('department')} aria-invalid={!!showError('department')} />
              {showError('department') && <p className="text-xs text-destructive">{errors.department}</p>}
            </div>
            <div className="space-y-1">
              <Input type="email" placeholder="Email" value={values.email} onChange={set('email')} aria-invalid={!!showError('email')} />
              {showError('email') && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>
          <Button type="submit" variant="outline" disabled={adding}>
            {adding ? <FiLoader className="size-4 animate-spin" /> : <FiPlus className="size-4" />}
            {adding ? 'Adding…' : 'Add Host'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function HostRow({ host }) {
  const dispatch = useDispatch()
  const mutating = useSelector((s) => selectIsHostMutating(s, host.id))

  const handleRemove = async () => {
    try {
      await dispatch(deleteHost(host.id)).unwrap()
      toast.success(`${host.name} removed`)
    } catch (message) {
      toast.error(message || 'Could not remove host')
    }
  }

  return (
    <li className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2">
      <AvatarInitials name={host.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{host.name}</p>
        <p className="truncate text-xs text-muted-foreground">{host.department} · {host.email}</p>
      </div>
      <button
        type="button"
        onClick={handleRemove}
        disabled={mutating}
        aria-label={`Remove ${host.name}`}
        className="shrink-0 rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-50"
      >
        {mutating ? <FiLoader className="size-3.5 animate-spin" /> : <FiX className="size-3.5" />}
      </button>
    </li>
  )
}

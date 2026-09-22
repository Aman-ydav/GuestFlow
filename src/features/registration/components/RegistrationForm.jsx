import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FiLoader } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { fetchHosts, hostSelectors } from '@/features/approval/hostsSlice'
import { registerVisitor } from '../visitorsSlice'
import { PhotoCapture } from './PhotoCapture'
import { VISIT_TYPES } from '@/constants/visitTypes'
import { required, isEmail, isPhone, composeValidators, validate } from '@/lib/validators'

const RULES = {
  name: required('Full name'),
  phone: composeValidators(required('Phone number'), isPhone),
  email: isEmail,
  purpose: required('Purpose of visit'),
  hostId: required('Host'),
  visitType: required('Visit type'),
  photoUrl: required('A photo'),
}

const INITIAL_VALUES = { name: '', phone: '', email: '', purpose: '', company: '', hostId: '', visitType: '', photoUrl: null }

export function RegistrationForm({ onRegistered }) {
  const dispatch = useDispatch()
  const hosts = useSelector(hostSelectors.selectAll)
  const [values, setValues] = useState(INITIAL_VALUES)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (hosts.length === 0) dispatch(fetchHosts())
  }, [dispatch, hosts.length])

  const errors = useMemo(() => validate(values, RULES), [values])
  const isValid = Object.keys(errors).length === 0

  const set = (field) => (value) => setValues((v) => ({ ...v, [field]: value }))
  const setFromEvent = (field) => (e) => set(field)(e.target.value)
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }))
  const showError = (field) => touched[field] && errors[field]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(Object.keys(RULES).map((k) => [k, true])))
    if (!isValid) return
    setSubmitting(true)
    try {
      const visitor = await dispatch(registerVisitor(values)).unwrap()
      toast.success(`Registered — waiting for ${hosts.find((h) => h.id === values.hostId)?.name ?? 'host'}'s approval`)
      setValues(INITIAL_VALUES)
      setTouched({})
      onRegistered?.(visitor)
    } catch (message) {
      toast.error(message || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" value={values.name} onChange={setFromEvent('name')} onBlur={blur('name')} aria-invalid={!!showError('name')} />
          {showError('name') && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" inputMode="numeric" value={values.phone} onChange={setFromEvent('phone')} onBlur={blur('phone')} aria-invalid={!!showError('phone')} />
          {showError('phone') && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={values.email} onChange={setFromEvent('email')} onBlur={blur('email')} aria-invalid={!!showError('email')} />
          {showError('email') && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">Company / Organization</Label>
          <Input id="company" value={values.company} onChange={setFromEvent('company')} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purpose">Purpose of Visit *</Label>
          <Input id="purpose" value={values.purpose} onChange={setFromEvent('purpose')} onBlur={blur('purpose')} aria-invalid={!!showError('purpose')} placeholder="e.g. Meeting with Priya Sharma" />
          {showError('purpose') && <p className="text-xs text-destructive">{errors.purpose}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="visitType">Type of Visit *</Label>
          <Select value={values.visitType} onValueChange={(v) => { set('visitType')(v); blur('visitType')(); }}>
            <SelectTrigger id="visitType" className="w-full" aria-invalid={!!showError('visitType')}>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {VISIT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showError('visitType') && <p className="text-xs text-destructive">{errors.visitType}</p>}
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="hostId">Host Employee *</Label>
          <Select value={values.hostId} onValueChange={(v) => { set('hostId')(v); blur('hostId')(); }}>
            <SelectTrigger id="hostId" className="w-full" aria-invalid={!!showError('hostId')}>
              <SelectValue placeholder={hosts.length ? 'Select the employee you are visiting' : 'Loading hosts…'} />
            </SelectTrigger>
            <SelectContent>
              {hosts.map((h) => (
                <SelectItem key={h.id} value={h.id}>{h.name} — {h.department}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {showError('hostId') && <p className="text-xs text-destructive">{errors.hostId}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Photo *</Label>
        <PhotoCapture value={values.photoUrl} onChange={(v) => { set('photoUrl')(v); blur('photoUrl')(); }} error={showError('photoUrl')} />
      </div>

      <Button type="submit" disabled={submitting} className="btn-cta w-full sm:w-auto">
        {submitting && <FiLoader className="size-4 animate-spin" />}
        {submitting ? 'Registering…' : 'Register Visitor'}
      </Button>
    </form>
  )
}

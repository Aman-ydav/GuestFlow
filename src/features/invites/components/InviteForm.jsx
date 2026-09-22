import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FiLoader, FiSend } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MultiSelectCombobox } from '@/components/MultiSelectCombobox'
import { DatePicker } from '@/components/DatePicker'
import { VISIT_TYPES } from '@/constants/visitTypes'
import { selectConfig } from '@/features/admin/configSlice'
import { selectCurrentHostId } from '@/core/uiSlice'
import { fetchVisitors, visitorSelectors } from '@/features/registration/visitorsSlice'
import { required, validate } from '@/lib/validators'
import { createInvite } from '../invitesSlice'

const endTimeRule = (value, all) => {
  const requiredError = required('End time')(value)
  if (requiredError) return requiredError
  if (!all.date || !all.startTime) return null
  return value <= all.startTime ? 'End time must be after start time' : null
}

const RULES = {
  title: required('Event title'),
  visitType: required('Type of visit'),
  officeId: required('Office'),
  date: required('Date'),
  startTime: required('Start time'),
  endTime: endTimeRule,
}

const INITIAL = { title: '', visitType: '', officeId: '', date: '', startTime: '', endTime: '', guestIds: [], note: '' }

export function InviteForm() {
  const dispatch = useDispatch()
  const config = useSelector(selectConfig)
  const hostId = useSelector(selectCurrentHostId)
  const visitors = useSelector(visitorSelectors.selectAll)
  const [values, setValues] = useState(INITIAL)
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (visitors.length === 0) dispatch(fetchVisitors())
  }, [dispatch, visitors.length])

  const guestOptions = useMemo(
    () => visitors.slice(0, 200).map((v) => ({ id: v.id, name: v.name, meta: `${v.phone} ${v.email ?? ''}` })),
    [visitors]
  )

  const errors = useMemo(() => validate(values, RULES), [values])
  const isValid = Object.keys(errors).length === 0 && values.guestIds.length > 0

  const set = (field) => (value) => setValues((v) => ({ ...v, [field]: value }))
  const setFromEvent = (field) => (e) => set(field)(e.target.value)
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }))
  const showError = (field) => touched[field] && errors[field]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(Object.keys(RULES).map((k) => [k, true])))
    if (!isValid || !hostId) return
    setSubmitting(true)
    try {
      const windowStart = new Date(`${values.date}T${values.startTime}`).toISOString()
      const windowEnd = new Date(`${values.date}T${values.endTime}`).toISOString()
      await dispatch(
        createInvite({
          title: values.title,
          visitType: values.visitType,
          officeId: values.officeId,
          hostId,
          guestIds: values.guestIds,
          windowStart,
          windowEnd,
          note: values.note,
        })
      ).unwrap()
      toast.success('Invite sent — guests will get a QR e-pass')
      setValues(INITIAL)
      setTouched({})
    } catch (message) {
      toast.error(message || 'Could not create the invite')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Event Title *</Label>
        <Input id="title" value={values.title} onChange={setFromEvent('title')} onBlur={blur('title')} aria-invalid={!!showError('title')} />
        {showError('title') && <p className="text-xs text-destructive">{errors.title}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="visitType">Type of Visit *</Label>
          <Select value={values.visitType} onValueChange={(v) => { set('visitType')(v); blur('visitType')(); }}>
            <SelectTrigger id="visitType" className="w-full" aria-invalid={!!showError('visitType')}>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              {VISIT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          {showError('visitType') && <p className="text-xs text-destructive">{errors.visitType}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="officeId">Office *</Label>
          <Select value={values.officeId} onValueChange={(v) => { set('officeId')(v); blur('officeId')(); }}>
            <SelectTrigger id="officeId" className="w-full" aria-invalid={!!showError('officeId')}>
              <SelectValue placeholder="Select an office" />
            </SelectTrigger>
            <SelectContent>
              {config.offices?.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {showError('officeId') && <p className="text-xs text-destructive">{errors.officeId}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date *</Label>
          <DatePicker id="date" value={values.date} onChange={set('date')} onBlur={blur('date')} aria-invalid={!!showError('date')} />
          {showError('date') && <p className="text-xs text-destructive">{errors.date}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input id="startTime" type="time" value={values.startTime} onChange={setFromEvent('startTime')} onBlur={blur('startTime')} aria-invalid={!!showError('startTime')} />
          {showError('startTime') && <p className="text-xs text-destructive">{errors.startTime}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="endTime">End Time *</Label>
          <Input id="endTime" type="time" value={values.endTime} onChange={setFromEvent('endTime')} onBlur={blur('endTime')} aria-invalid={!!showError('endTime')} />
          {showError('endTime') && <p className="text-xs text-destructive">{errors.endTime}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Guests *</Label>
        <MultiSelectCombobox
          options={guestOptions}
          value={values.guestIds}
          onChange={set('guestIds')}
          placeholder="Search by name, id, email or phone"
        />
        {touched.title && values.guestIds.length === 0 && (
          <p className="text-xs text-destructive">Add at least one guest</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">Personal note to guests</Label>
        <Textarea id="note" value={values.note} onChange={setFromEvent('note')} placeholder="Optional" rows={2} />
      </div>

      <Button type="submit" disabled={submitting} className="btn-cta w-full sm:w-auto">
        {submitting ? <FiLoader className="size-4 animate-spin" /> : <FiSend className="size-4" />}
        {submitting ? 'Sending…' : 'Confirm Invite'}
      </Button>
    </form>
  )
}

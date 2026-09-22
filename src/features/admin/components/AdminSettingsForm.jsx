import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { FiLoader, FiSave, FiPlus, FiX, FiMapPin, FiRefreshCw } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { resetMockData } from '@/mocks/mockApiStore'
import { fetchConfig, updateConfig, selectConfig } from '../configSlice'

export function AdminSettingsForm() {
  const dispatch = useDispatch()
  const config = useSelector(selectConfig)

  useEffect(() => {
    dispatch(fetchConfig())
  }, [dispatch])

  if (config.status !== 'succeeded') {
    return <p className="py-10 text-center text-sm text-muted-foreground">Loading settings…</p>
  }

  // Only mounts once fetchConfig has actually resolved, so its local edit state
  // starts from real data — avoids syncing store→local state via an effect
  // (see PhotoCapture for the same pattern: derive/key instead of setState-in-effect).
  return <AdminSettingsFormFields config={config} />
}

function AdminSettingsFormFields({ config }) {
  const dispatch = useDispatch()
  const [limit, setLimit] = useState(config.preApprovalLimit)
  const [overstay, setOverstay] = useState(config.overstayMinutes)
  const [offices, setOffices] = useState(config.offices ?? [])
  const [newOffice, setNewOffice] = useState('')
  const [saving, setSaving] = useState(false)

  const addOffice = () => {
    const name = newOffice.trim()
    if (!name) return
    setOffices((prev) => [...prev, { id: `off-${Date.now()}`, name }])
    setNewOffice('')
  }
  const removeOffice = (id) => setOffices((prev) => prev.filter((o) => o.id !== id))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await dispatch(
        updateConfig({ preApprovalLimit: Number(limit), overstayMinutes: Number(overstay), offices })
      ).unwrap()
      toast.success('Settings saved')
    } catch (message) {
      toast.error(message || 'Could not save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="limit">Pre-approval limit (per host / day)</Label>
            <Input id="limit" type="number" min="1" max="50" value={limit} onChange={(e) => setLimit(e.target.value)} />
            <p className="text-xs text-muted-foreground">Blocks a host from creating more than this many active invites in one day.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="overstay">Overstay threshold (minutes)</Label>
            <Input id="overstay" type="number" min="15" max="600" value={overstay} onChange={(e) => setOverstay(e.target.value)} />
            <p className="text-xs text-muted-foreground">A checked-in visitor is flagged "Overstay" past this duration.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Label>Offices</Label>
          <p className="mt-1 text-xs text-muted-foreground">Locations available when scheduling an invite.</p>
          <Separator className="my-4" />
          <ul className="space-y-2">
            {offices.map((office) => (
              <li key={office.id} className="flex items-center gap-2.5 rounded-md border border-border px-3 py-2">
                <FiMapPin className="size-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm">{office.name}</span>
                <button
                  type="button"
                  onClick={() => removeOffice(office.id)}
                  aria-label={`Remove ${office.name}`}
                  className="rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <FiX className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex gap-2">
            <Input
              value={newOffice}
              onChange={(e) => setNewOffice(e.target.value)}
              placeholder="e.g. Pune Hinjewadi"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addOffice()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addOffice}>
              <FiPlus className="size-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} className="btn-cta">
        {saving ? <FiLoader className="size-4 animate-spin" /> : <FiSave className="size-4" />}
        {saving ? 'Saving…' : 'Save Settings'}
      </Button>

      <Card className="border-destructive/30">
        <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">Reset Demo Data</p>
            <p className="text-xs text-muted-foreground">
              Wipes everything you've approved/rejected/checked in and reseeds a fresh mock dataset. Demo-only — there's no undo.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="outline" className="shrink-0 border-destructive/30 text-destructive hover:bg-destructive/10">
                <FiRefreshCw className="size-3.5" /> Reset Demo Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all demo data?</AlertDialogTitle>
                <AlertDialogDescription>
                  Every visitor, invite, and setting you've changed this session will be discarded and replaced with a fresh
                  seeded dataset. This can't be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetMockData} className="bg-destructive text-white hover:bg-destructive/90">
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </form>
  )
}

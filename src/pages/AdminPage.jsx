import { FlowBanner } from '@/components/FlowBanner'
import { AdminSettingsForm } from '@/features/admin/components/AdminSettingsForm'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <FlowBanner flowKey="admin" />
      <AdminSettingsForm />
    </div>
  )
}

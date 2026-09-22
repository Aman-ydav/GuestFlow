import { FlowBanner } from '@/components/FlowBanner'
import { AdminSettingsForm } from '@/features/admin/components/AdminSettingsForm'
import { ManageHostsSection } from '@/features/admin/components/ManageHostsSection'

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <FlowBanner flowKey="admin" />
      <AdminSettingsForm />
      <ManageHostsSection />
    </div>
  )
}

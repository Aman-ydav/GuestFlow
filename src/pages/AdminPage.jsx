import { FiSettings } from 'react-icons/fi'
import { ComingSoonPage } from './ComingSoonPage'

export default function AdminPage() {
  return (
    <ComingSoonPage
      icon={FiSettings}
      title="Admin — coming next"
      description="Configure the pre-approval limit, overstay threshold, and offices."
    />
  )
}

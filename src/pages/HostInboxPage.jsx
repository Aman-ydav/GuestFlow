import { FiInbox } from 'react-icons/fi'
import { ComingSoonPage } from './ComingSoonPage'

export default function HostInboxPage() {
  return (
    <ComingSoonPage
      icon={FiInbox}
      title="Host Inbox — coming next"
      description="Approve/reject pending visitor requests with audit history. Building this flow next."
    />
  )
}

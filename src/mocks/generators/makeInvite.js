import { VISIT_TYPES, OFFICES } from '@/constants/visitTypes'

const TITLES = ['Client meeting', 'Vendor walkthrough', 'Interview panel', 'Contractor visit', 'Partner sync']
const INVITE_STATUSES = ['invited', 'checked-in', 'expired', 'cancelled']

function randomFrom(arr, seed) {
  return arr[seed % arr.length]
}

export function makeInvite(index, hosts, visitors) {
  const host = hosts[index % hosts.length]
  const status = randomFrom(INVITE_STATUSES, index * 17 + 5)
  const baseOffset = (index % 10) - 5 // spread across past/future days
  const windowStart = Date.now() + baseOffset * 1000 * 60 * 60 * 24
  const windowEnd = windowStart + 1000 * 60 * 60 * 2 // 2-hour window
  const guestCount = 1 + (index % 3)
  const guestIds = Array.from({ length: guestCount }, (_, i) => visitors[(index + i) % visitors.length]?.id).filter(Boolean)

  return {
    id: `invite-${index}`,
    code: `GF-${String(index).padStart(5, '0')}`,
    title: randomFrom(TITLES, index),
    visitType: randomFrom(VISIT_TYPES, index * 9),
    officeId: randomFrom(OFFICES, index * 4).id,
    hostId: host.id,
    guestIds,
    windowStart: new Date(windowStart).toISOString(),
    windowEnd: new Date(windowEnd).toISOString(),
    note: index % 3 === 0 ? 'Please report at Front Desk' : '',
    status,
    createdAt: new Date(windowStart - 1000 * 60 * 60 * 24).toISOString(),
  }
}

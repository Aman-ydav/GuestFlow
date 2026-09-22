import { VISIT_TYPES } from '@/constants/visitTypes'

const FIRST_NAMES = ['Dhulabhai', 'Ajay', 'Geeta', 'Jagesh', 'Vanraj', 'Nilesh', 'Sanjay', 'Sukhdev', 'Vinod', 'Teja', 'Akshay', 'Pooja', 'Rakesh', 'Farhan', 'Ishaan']
const LAST_NAMES = ['Bamania', 'Singh', 'Gohil', 'Patidar', 'Gandhi', 'Ahari', 'Dindor', 'Maru', 'Neeradi', 'Malhotra', 'Chauhan']
const COMPANIES = ['Walsons', 'Bluepeak Logistics', 'Nimbus Traders', 'Orbit Systems', 'Crestview Consulting', null]
const STATUSES = ['pending', 'approved', 'rejected', 'checked-in', 'checked-out']

function randomFrom(arr, seed) {
  return arr[seed % arr.length]
}

/**
 * One visitor record. Statuses/timestamps are generated so the mock dataset
 * exercises every UI state (pending, overstay, checked-out, rejected) without
 * hand-writing each one.
 */
export function makeVisitor(index, hosts) {
  const first = randomFrom(FIRST_NAMES, index)
  const last = randomFrom(LAST_NAMES, index * 7 + 3)
  const name = `${first} ${last}`
  const host = hosts[index % hosts.length]
  const status = randomFrom(STATUSES, index * 13 + 1)
  const createdAt = Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 14) // up to 14 days back

  const isCheckedInOrLater = ['checked-in', 'checked-out'].includes(status)
  const checkedInAt = isCheckedInOrLater ? createdAt + 1000 * 60 * Math.floor(Math.random() * 30) : null
  // ~15% of checked-in visitors overstay (stayed > 2h) to exercise the overstay badge
  const stayMinutes = status === 'checked-in' && Math.random() < 0.35 ? 150 + Math.floor(Math.random() * 90) : Math.floor(Math.random() * 90)
  const checkedOutAt = status === 'checked-out' ? checkedInAt + 1000 * 60 * stayMinutes : null

  return {
    id: `visitor-${index}`,
    name,
    phone: `9${String(Math.floor(100000000 + Math.random() * 899999999))}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    purpose: randomFrom(['Meeting', 'Interview', 'Delivery', 'Maintenance', 'Vendor visit'], index * 5),
    hostId: host.id,
    company: randomFrom(COMPANIES, index * 3),
    visitType: randomFrom(VISIT_TYPES, index * 11),
    photoUrl: null,
    status,
    checkedInAt: checkedInAt ? new Date(checkedInAt).toISOString() : null,
    checkedOutAt: checkedOutAt ? new Date(checkedOutAt).toISOString() : null,
    createdAt: new Date(createdAt).toISOString(),
    sourceInviteId: null,
  }
}

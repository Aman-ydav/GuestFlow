import { format, formatDistanceToNow, isToday, isWithinInterval } from 'date-fns'

export function formatTime(date) {
  if (!date) return '—'
  return format(new Date(date), 'h:mm a')
}

export function formatDateTime(date) {
  if (!date) return '—'
  return format(new Date(date), 'MMM d, yyyy · h:mm a')
}

export function formatRelative(date) {
  if (!date) return '—'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function isSameDay(date, day) {
  if (!date || !day) return false
  return format(new Date(date), 'yyyy-MM-dd') === format(new Date(day), 'yyyy-MM-dd')
}

export { isToday, isWithinInterval }

/** Complexity: O(1) — single arithmetic comparison, no allocation. */
export function isOverstay(visitor, overstayMinutes, now = Date.now()) {
  if (visitor.status !== 'checked-in' || !visitor.checkedInAt) return false
  const elapsedMinutes = (now - new Date(visitor.checkedInAt).getTime()) / 60000
  return elapsedMinutes > overstayMinutes
}

/** Complexity: O(1) — derived purely from stored timestamps, no timers needed. */
export function isInviteExpired(invite, now = Date.now()) {
  if (invite.status !== 'invited') return false
  return now > new Date(invite.windowEnd).getTime()
}

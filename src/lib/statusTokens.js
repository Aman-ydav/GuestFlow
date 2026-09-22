import { isOverstay } from './dateUtils'

/**
 * One place that maps a status string to its display label + Tailwind classes.
 * Never hardcode a status color in a component — import STATUS_TOKENS instead.
 * "Soft badge" style (tinted bg + saturated text) — flat, no gradients. Light
 * theme only (see docs/03-design-system.md) — no dark: variants here on purpose.
 */
export const STATUS_TOKENS = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800',
  },
  invited: {
    label: 'Invited',
    className: 'bg-indigo-100 text-indigo-800',
  },
  approved: {
    label: 'Approved',
    className: 'bg-teal-100 text-teal-800',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800',
  },
  'checked-in': {
    label: 'Checked In',
    className: 'bg-blue-100 text-blue-800',
  },
  'checked-out': {
    label: 'Checked Out',
    className: 'bg-zinc-100 text-zinc-600',
  },
  overstay: {
    label: 'Overstay',
    className: 'bg-red-100 text-red-700 font-semibold',
  },
  expired: {
    label: 'Expired',
    className: 'bg-zinc-100 text-zinc-500',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-zinc-100 text-zinc-500 line-through',
  },
}

export function getStatusToken(status) {
  return STATUS_TOKENS[status] ?? { label: status, className: 'bg-zinc-100 text-zinc-600' }
}

/**
 * "Overstay" isn't a stored status — it's `checked-in` past the configured
 * threshold, derived on read (see docs/design-decisions.md § Complexity: O(1),
 * always correct whether or not a sweep ran). This is the one place that
 * turns the derived fact into the status string the rest of the UI displays.
 */
export function getDisplayStatus(visitor, overstayMinutes, now = Date.now()) {
  return isOverstay(visitor, overstayMinutes, now) ? 'overstay' : visitor.status
}

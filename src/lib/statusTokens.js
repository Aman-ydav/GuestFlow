import { isOverstay } from './dateUtils'

/**
 * One place that maps a status string to its display label + Tailwind classes.
 * Never hardcode a status color in a component — import STATUS_TOKENS instead.
 * "Soft badge" style (tinted bg + saturated text) — flat, no gradients. `dark:`
 * variants matter again now that the dashboard has a real toggle (scoped to
 * /app/*, see hooks/useTheme.js) — they're inert on the marketing site, which
 * never gets the `.dark` ancestor class.
 */
export const STATUS_TOKENS = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  },
  invited: {
    label: 'Invited',
    className: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
  },
  approved: {
    label: 'Approved',
    className: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
  },
  'checked-in': {
    label: 'Checked In',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
  },
  'checked-out': {
    label: 'Checked Out',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  },
  overstay: {
    label: 'Overstay',
    className: 'bg-red-100 text-red-700 font-semibold dark:bg-red-950 dark:text-red-300',
  },
  expired: {
    label: 'Expired',
    className: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-zinc-100 text-zinc-500 line-through dark:bg-zinc-800 dark:text-zinc-500',
  },
}

export function getStatusToken(status) {
  return STATUS_TOKENS[status] ?? { label: status, className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' }
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

/**
 * Single source of truth for every allowed visitor/invite status change.
 * Every status mutation in the app MUST go through canTransition() — never
 * set `.status` directly. This is what makes an invalid operation (checking
 * out a visitor who never checked in, approving an expired invite) impossible
 * by construction rather than by UI discipline alone.
 */
export const VISITOR_TRANSITIONS = {
  pending: ['approved', 'rejected'],
  approved: ['checked-in'],
  rejected: [],
  invited: ['checked-in', 'expired', 'cancelled'],
  'checked-in': ['checked-out'],
  'checked-out': [],
  expired: [],
  cancelled: [],
}

export function canTransition(from, to) {
  return VISITOR_TRANSITIONS[from]?.includes(to) ?? false
}

export const TERMINAL_STATUSES = ['rejected', 'checked-out', 'expired', 'cancelled']

export function isTerminal(status) {
  return TERMINAL_STATUSES.includes(status)
}

import { describe, it, expect } from 'vitest'
import { canTransition, isTerminal } from './statusTransitions'

describe('canTransition — the single source of truth for status changes', () => {
  it('allows the documented happy paths', () => {
    expect(canTransition('pending', 'approved')).toBe(true)
    expect(canTransition('pending', 'rejected')).toBe(true)
    expect(canTransition('approved', 'checked-in')).toBe(true)
    expect(canTransition('checked-in', 'checked-out')).toBe(true)
    expect(canTransition('invited', 'checked-in')).toBe(true)
    expect(canTransition('invited', 'expired')).toBe(true)
    expect(canTransition('invited', 'cancelled')).toBe(true)
  })

  it('rejects the classic invalid moves', () => {
    expect(canTransition('pending', 'checked-out')).toBe(false) // check-out before check-in
    expect(canTransition('rejected', 'approved')).toBe(false) // resurrecting a rejected visitor
    expect(canTransition('checked-out', 'checked-in')).toBe(false) // re-entering after checkout
    expect(canTransition('expired', 'checked-in')).toBe(false) // checking in on an expired invite
  })

  it('has no transitions out of terminal statuses', () => {
    for (const status of ['rejected', 'checked-out', 'expired', 'cancelled']) {
      expect(isTerminal(status)).toBe(true)
    }
  })
})

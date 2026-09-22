import { describe, it, expect } from 'vitest'
import reducer, { registerVisitor, transitionVisitor } from './visitorsSlice'

const baseVisitor = { id: 'v1', name: 'Teja', status: 'pending', createdAt: new Date().toISOString() }

function withVisitor(status = 'pending') {
  return reducer(undefined, registerVisitor.fulfilled({ ...baseVisitor, status }, '', {}))
}

describe('visitorsSlice — status transition table', () => {
  it('allows pending -> approved', () => {
    const state = withVisitor('pending')
    const next = reducer(state, transitionVisitor.fulfilled({ ...baseVisitor, status: 'approved' }, '', { id: 'v1', to: 'approved' }))
    expect(next.entities.v1.status).toBe('approved')
    expect(next.error).toBeNull()
  })

  it('rejects check-out before check-in (the classic invalid transition)', () => {
    // the service layer is what actually enforces this and would reject the promise;
    // this test locks down that a rejected thunk never mutates status, only sets error.
    const state = withVisitor('pending')
    const next = reducer(
      state,
      transitionVisitor.rejected(new Error('rejected'), '', { id: 'v1', to: 'checked-out' }, 'Cannot move visitor from "pending" to "checked-out"')
    )
    expect(next.entities.v1.status).toBe('pending') // unchanged
    expect(next.error).toMatch(/Cannot move/)
  })

  it('registerVisitor.fulfilled adds a new entity', () => {
    const state = withVisitor('pending')
    expect(state.ids).toContain('v1')
    expect(state.entities.v1.name).toBe('Teja')
  })

  it('tracks mutatingIds while a transition is pending, clears it on settle', () => {
    let state = withVisitor('pending')
    state = reducer(state, transitionVisitor.pending('reqId', { id: 'v1', to: 'approved' }))
    expect(state.mutatingIds).toContain('v1')
    state = reducer(state, transitionVisitor.fulfilled({ ...baseVisitor, status: 'approved' }, 'reqId', { id: 'v1', to: 'approved' }))
    expect(state.mutatingIds).not.toContain('v1')
  })
})

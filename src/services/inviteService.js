import { apiClient, USE_MOCK_API } from './apiClient'
import db, { delay, maybeFail, persist } from '@/mocks/mockApiStore'

const dayKey = (hostId, isoDate) => `${hostId}|${isoDate.slice(0, 10)}`

export async function listInvites() {
  if (USE_MOCK_API) {
    await delay()
    return Array.from(db.invites.values())
  }
  return apiClient.get('/invites')
}

/** Complexity: O(n) over today's invites for this host — small n (a day's invites per
 *  host), acceptable; documented as the one place this could become an O(1) counter
 *  map if profiling ever showed it mattered (see docs/05-state-management-redux.md). */
export async function createInvite(fields) {
  if (USE_MOCK_API) {
    await delay(300, 700)
    maybeFail()
    const windowStart = fields.windowStart
    const key = dayKey(fields.hostId, windowStart)
    const countToday = Array.from(db.invites.values()).filter(
      (inv) => inv.status === 'invited' && dayKey(inv.hostId, inv.windowStart) === key
    ).length
    if (countToday >= db.config.preApprovalLimit) {
      throw { message: `Daily pre-approval limit (${db.config.preApprovalLimit}) reached for this host`, status: 409 }
    }
    if (new Date(fields.windowEnd) <= new Date(fields.windowStart)) {
      throw { message: 'End time must be after start time', status: 422 }
    }
    const id = `invite-${Date.now()}`
    const invite = {
      id,
      code: `GF-${Date.now().toString(36).toUpperCase()}`,
      status: 'invited',
      createdAt: new Date().toISOString(),
      ...fields,
    }
    db.invites.set(id, invite)
    persist()
    return invite
  }
  return apiClient.post('/invites', fields)
}

export async function cancelInvite(id) {
  if (USE_MOCK_API) {
    await delay(200, 400)
    maybeFail()
    const invite = db.invites.get(id)
    if (!invite) throw { message: `Invite ${id} not found`, status: 404 }
    if (invite.status !== 'invited') throw { message: `Only an active invite can be cancelled`, status: 409 }
    const updated = { ...invite, status: 'cancelled' }
    db.invites.set(id, updated)
    persist()
    return updated
  }
  return apiClient.post(`/invites/${id}/cancel`)
}

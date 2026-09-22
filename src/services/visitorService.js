import { apiClient, USE_MOCK_API } from './apiClient'
import db, { delay, maybeFail } from '@/mocks/mockApiStore'
import { canTransition } from '@/lib/statusTransitions'

export async function listVisitors(params = {}) {
  if (USE_MOCK_API) {
    await delay()
    return Array.from(db.visitors.values())
  }
  return apiClient.get('/visitors', { params })
}

export async function getVisitor(id) {
  if (USE_MOCK_API) {
    await delay(50, 150)
    const visitor = db.visitors.get(id)
    if (!visitor) throw { message: `Visitor ${id} not found`, status: 404 }
    return visitor
  }
  return apiClient.get(`/visitors/${id}`)
}

export async function registerVisitor(fields) {
  if (USE_MOCK_API) {
    await delay(300, 700)
    maybeFail()
    const id = `visitor-${Date.now()}`
    const visitor = {
      id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      checkedInAt: null,
      checkedOutAt: null,
      sourceInviteId: null,
      photoUrl: null,
      ...fields,
    }
    db.visitors.set(id, visitor)
    return visitor
  }
  return apiClient.post('/visitors', fields)
}

/** Shared by approve/reject/check-in/check-out — enforces the transition table so an
 *  invalid move is rejected here, in one place, not by UI discipline at each call site. */
export async function transitionVisitor(id, to, actorId = 'system') {
  if (USE_MOCK_API) {
    await delay(300, 600)
    maybeFail()
    const visitor = db.visitors.get(id)
    if (!visitor) throw { message: `Visitor ${id} not found`, status: 404 }
    if (!canTransition(visitor.status, to)) {
      throw { message: `Cannot move visitor from "${visitor.status}" to "${to}"`, status: 409 }
    }
    const now = new Date().toISOString()
    const updated = {
      ...visitor,
      status: to,
      ...(to === 'checked-in' ? { checkedInAt: now } : {}),
      ...(to === 'checked-out' ? { checkedOutAt: now } : {}),
    }
    db.visitors.set(id, updated)
    db.auditEvents.push({ id: `evt-${Date.now()}`, visitorId: id, action: to, actorId, at: now })
    return updated
  }
  return apiClient.post(`/visitors/${id}/transition`, { to })
}

export async function listAuditEvents(visitorId) {
  if (USE_MOCK_API) {
    await delay(50, 150)
    return db.auditEvents.filter((e) => e.visitorId === visitorId)
  }
  return apiClient.get('/audit', { params: { visitorId } })
}

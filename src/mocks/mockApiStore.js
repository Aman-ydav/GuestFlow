import { hostsMock } from './hosts.mock'
import { visitorsMock } from './visitors.mock'
import { invitesMock } from './invites.mock'
import { configMock } from './config.mock'

/**
 * The in-memory "database" behind the mock API. Genuinely mutable (Map keyed
 * by id) so approve/reject/check-in actually persist for the session, not
 * just a static read-only array. Only services/*Service.js reads this —
 * components never import mocks/ directly.
 */
const db = {
  hosts: new Map(hostsMock.map((h) => [h.id, h])),
  visitors: new Map(visitorsMock.map((v) => [v.id, v])),
  invites: new Map(invitesMock.map((i) => [i.id, i])),
  auditEvents: [],
  config: { ...configMock },
}

export function delay(min = 200, max = 600) {
  const ms = min + Math.random() * (max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** ~8% simulated failure rate on writes — exercises error-handling UI paths. */
export function maybeFail(rate = 0.08) {
  if (Math.random() < rate) {
    const error = new Error('The server is taking too long to respond. Please try again.')
    error.status = 503
    throw error
  }
}

export default db

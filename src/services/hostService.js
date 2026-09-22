import { apiClient, USE_MOCK_API } from './apiClient'
import db, { delay, maybeFail, persist } from '@/mocks/mockApiStore'

export async function listHosts() {
  if (USE_MOCK_API) {
    await delay()
    return Array.from(db.hosts.values())
  }
  return apiClient.get('/hosts')
}

export async function getHost(id) {
  if (USE_MOCK_API) {
    await delay(50, 150)
    const host = db.hosts.get(id)
    if (!host) throw { message: `Host ${id} not found`, status: 404 }
    return host
  }
  return apiClient.get(`/hosts/${id}`)
}

export async function createHost(fields) {
  if (USE_MOCK_API) {
    await delay(300, 600)
    maybeFail()
    const id = `host-${Date.now()}`
    const host = { id, ...fields }
    db.hosts.set(id, host)
    persist()
    return host
  }
  return apiClient.post('/hosts', fields)
}

/** Demo-only removal — doesn't cascade to existing visitors/invites that
 *  reference this host by id; they just render "—" where the host name was
 *  (the same fallback already used everywhere a host lookup can miss). A real
 *  system would block or reassign first; not worth the complexity here. */
export async function deleteHost(id) {
  if (USE_MOCK_API) {
    await delay(200, 400)
    maybeFail()
    if (!db.hosts.has(id)) throw { message: `Host ${id} not found`, status: 404 }
    db.hosts.delete(id)
    persist()
    return { id }
  }
  return apiClient.delete(`/hosts/${id}`)
}

import { apiClient, USE_MOCK_API } from './apiClient'
import db, { delay } from '@/mocks/mockApiStore'

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

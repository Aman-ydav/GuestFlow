import { apiClient, USE_MOCK_API } from './apiClient'
import db, { delay } from '@/mocks/mockApiStore'

export async function getConfig() {
  if (USE_MOCK_API) {
    await delay(50, 150)
    return { ...db.config }
  }
  return apiClient.get('/config')
}

export async function updateConfig(patch) {
  if (USE_MOCK_API) {
    await delay(200, 400)
    Object.assign(db.config, patch)
    return { ...db.config }
  }
  return apiClient.put('/config', patch)
}

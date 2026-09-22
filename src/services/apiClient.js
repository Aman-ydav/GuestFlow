import axios from 'axios'

/**
 * One shared axios instance. Only used when VITE_USE_MOCK_API is false — see
 * ../../docs/01-architecture-and-data.md. Every *Service.js file exports the
 * same async function signatures regardless of mode, so this file is the
 * only place that changes if/when a real backend is added.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = {
      message: error.response?.data?.message || error.message || 'Something went wrong.',
      status: error.response?.status,
      fieldErrors: error.response?.data?.fieldErrors,
    }
    return Promise.reject(normalized)
  }
)

export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

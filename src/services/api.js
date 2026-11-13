import axios from 'axios'
import { getAccessToken, setAccessToken } from './session'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 10000,
  withCredentials: true
})

client.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshRequest = null

export function refreshSession() {
  if (!refreshRequest) {
    refreshRequest = client.post('/api/v1/auth/refresh')
      .then((response) => {
        setAccessToken(response.data.accessToken)
        return response.data.user
      })
      .catch(() => {
        setAccessToken(null)
        return null
      })
      .finally(() => {
        refreshRequest = null
      })
  }
  return refreshRequest
}

client.interceptors.response.use((response) => response, async (error) => {
  const config = error.config
  const url = config?.url || ''
  if (error.response?.status === 401 && config && !config._retry && !url.includes('/api/v1/auth/')) {
    config._retry = true
    const user = await refreshSession()
    if (user) {
      return client(config)
    }
  }
  return Promise.reject(error)
})

export function login(username, password) {
  return client.post('/api/v1/auth/login', { username, password }).then((response) => {
    setAccessToken(response.data.accessToken)
    return response.data.user
  })
}

export function logout() {
  return client.post('/api/v1/auth/logout').finally(() => setAccessToken(null))
}

export function fetchSystemStatus() {
  return client.get('/api/v1/system/status').then((response) => response.data.data)
}

export function fetchDashboardSummary() {
  return client.get('/api/v1/dashboard/summary').then((response) => response.data.data)
}

export function fetchUsers() {
  return client.get('/api/v1/users').then((response) => response.data.data)
}

export function setUserEnabled(id, enabled) {
  return client.patch(`/api/v1/users/${id}/enabled`, { enabled })
}

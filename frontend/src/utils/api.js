const API_URL = '' // Uses Vite proxy

function getToken() {
  return localStorage.getItem('token')
}

async function api(endpoint, options = {}) {
  const url = `${API_URL}/api${endpoint}`
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(data?.error || `HTTP ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API error:', error)
    throw error
  }
}

export const auth = {
  register: (email, password, name) => api('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  }),
  login: (email, password) => api('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
}

export const monitors = {
  list: () => api('/monitors'),
  create: (url, name) => api('/monitors', {
    method: 'POST',
    body: JSON.stringify({ url, name }),
  }),
  get: (id) => api(`/monitors/${id}`),
  delete: (id) => api(`/monitors/${id}`, { method: 'DELETE' }),
  check: (id) => api(`/monitors/${id}/check`, { method: 'POST' }),
}

export const changes = {
  list: () => api('/changes'),
}

export const waitlist = {
  join: (email, company, useCase) => api('/waitlist', {
    method: 'POST',
    body: JSON.stringify({ email, company, useCase }),
  }),
}

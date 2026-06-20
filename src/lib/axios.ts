import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const AUTH_STORAGE_KEY = 'auth-storage'

function getToken(): string | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    return parsed?.state?.token ?? null
  } catch {
    return null
  }
}

function clearAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.startsWith('/auth/')
    ) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
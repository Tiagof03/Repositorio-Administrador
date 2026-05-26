import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // envía y recibe cookies automáticamente
})
 


api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // storage corrupto, se ignora
    }
  }
  return config
})

export default api
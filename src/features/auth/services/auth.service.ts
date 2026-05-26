import api from '@/lib/axios'
import type { LoginRequest, LoginResponse, MeResponse, RegisterRequest, Role } from '@/features/auth/types'
// Mapea la lista de roles del backend al rol único que usa el frontend.
// Prioridad: admin > cajero > empleado
function mapRoles(roles: string[]): Role {
  const normalized = roles.map((r) => r.toLowerCase())
  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('cajero')) return 'cajero'
  if (normalized.includes('empleado')) return 'empleado'
  // fallback por si el rol no coincide con ninguno esperado
  return 'empleado'
}
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  // El backend usa OAuth2PasswordRequestForm: form-urlencoded con campo "username"
  const formData = new URLSearchParams()
  formData.append('username', credentials.email)
  formData.append('password', credentials.password)
  const { data: tokenData } = await api.post('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })
  // Las cookies access_token y refresh_token ya fueron seteadas por el backend.
  // Ahora obtenemos los datos del usuario.
  const { data: me } = await api.get<MeResponse>('/auth/me')
  return {
    user: {
      id: me.id,
      nombre: me.nombre,
      email: me.email,
    },
    token: tokenData.access_token, 
    rol: mapRoles(me.roles),
  }
}
export const register = async (data: RegisterRequest): Promise<LoginResponse> => {
  const { data: tokenData } = await api.post('/auth/register', data)
  const { data: me } = await api.get<MeResponse>('/auth/me')
  return {
    user: {
      id: me.id,
      nombre: me.nombre,
      email: me.email,
    },
    token: tokenData.access_token,
    rol: mapRoles(me.roles),
  }
}
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

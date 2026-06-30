import api from '@/lib/axios'
import type { LoginRequest, LoginResponse, MeResponse, RegisterRequest, Role } from '@/features/auth/types'

function mapRoles(roles: string[]): Role {
  const normalized = roles.map((r) => r.toLowerCase())
  if (normalized.includes('admin')) return 'admin'
  if (normalized.includes('cajero')) return 'cajero'
  if (normalized.includes('pedidos')) return 'pedidos'
  if (normalized.includes('stock')) return 'stock'
  if (normalized.includes('cliente')) return 'cliente'

  return 'cliente'
}
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data: tokenData } = await api.post('/auth/login', credentials)
  const { data: me } = await api.get<MeResponse>('/auth/me')
  return {
    user: {
      id: me.id,
      nombre: me.nombre,
      apellido: me.apellido,
      email: me.email,
      celular: me.celular,
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
      apellido: me.apellido,
      email: me.email,
      celular: me.celular,
    },
    token: tokenData.access_token,
    rol: mapRoles(me.roles),
  }
}
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}

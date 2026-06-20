import api from '@/lib/axios'
import type { AdminUser, AdminUserUpdate, Rol } from '@/features/admin-users/types'

interface PaginatedUsers {
  items: AdminUser[]
  total: number
  page: number
  size: number
  pages: number
}

export const getUsers = async (params?: { page?: number; size?: number; rol?: string }): Promise<AdminUser[]> => {
  const { data } = await api.get<PaginatedUsers>('/usuarios/', { params })
  return data.items
}

export const getUserById = async (id: number): Promise<AdminUser> => {
  const { data } = await api.get<AdminUser>(`/usuarios/${id}`)
  return data
}

export const updateUser = async (id: number, payload: AdminUserUpdate): Promise<AdminUser> => {
  const { data } = await api.patch<AdminUser>(`/usuarios/${id}`, payload)
  return data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`)
}

export const assignRoles = async (id: number, roles: string[]): Promise<AdminUser> => {
  const { data } = await api.patch<AdminUser>(`/usuarios/${id}/roles`, { roles })
  return data
}

export const getRoles = async (): Promise<Rol[]> => {
  const { data } = await api.get<Rol[]>('/roles/')
  return data
}

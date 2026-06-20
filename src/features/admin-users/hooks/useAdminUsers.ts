import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignRoles,
  getRoles,
} from '@/features/admin-users/services/admin-users.service'
import type { AdminUser, AdminUserUpdate } from '@/features/admin-users/types'
import useToastStore from '@/store/toastStore'
const toast = useToastStore.getState
export const useAdminUsers = (params?: { page?: number; size?: number; rol?: string }) =>
  useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => getUsers(params),
  })
export const useAdminUser = (id: number) =>
  useQuery({
    queryKey: ['admin-users', id],
    queryFn: () => getUserById(id),
    enabled: id > 0,
  })
export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUserUpdate }) => updateUser(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast().addToast('success', 'Usuario actualizado correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al actualizar usuario')
    },
  })
}
export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast().addToast('success', 'Usuario eliminado correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al eliminar usuario')
    },
  })
}
export const useAssignRoles = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roles }: { id: number; roles: string[] }) => assignRoles(id, roles),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast().addToast('success', 'Roles asignados correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al asignar roles')
    },
  })
}
export const useRoles = () =>
  useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })
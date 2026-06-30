import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser } from '@/features/admin-users/services/admin-users.service'
import type { AdminUserUpdate } from '@/features/admin-users/types'
import useToastStore from '@/store/toastStore'

export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: AdminUserUpdate }) => updateUser(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            useToastStore.getState().addToast('success', 'Usuario actualizado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al actualizar usuario')
        },
    })
}
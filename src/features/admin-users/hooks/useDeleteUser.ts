import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from '@/features/admin-users/services/admin-users.service'
import useToastStore from '@/store/toastStore'

export const useDeleteUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            useToastStore.getState().addToast('success', 'Usuario eliminado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al eliminar usuario')
        },
    })
}
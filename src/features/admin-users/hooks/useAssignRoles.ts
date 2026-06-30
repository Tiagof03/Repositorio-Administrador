import { useMutation, useQueryClient } from '@tanstack/react-query'
import { assignRoles } from '@/features/admin-users/services/admin-users.service'
import useToastStore from '@/store/toastStore'

export const useAssignRoles = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, roles }: { id: number; roles: string[] }) => assignRoles(id, roles),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            useToastStore.getState().addToast('success', 'Roles asignados correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al asignar roles')
        },
    })
}
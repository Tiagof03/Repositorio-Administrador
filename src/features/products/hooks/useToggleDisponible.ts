import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleProductDisponible } from '@/features/products/services/products.service'
import useToastStore from '@/store/toastStore'

export const useToggleDisponible = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
            toggleProductDisponible(id, disponible),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['products'] })
            useToastStore.getState().addToast('success', 'Disponibilidad actualizada')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al actualizar disponibilidad')
        },
    })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrderStatus } from '@/features/orders/services/orders.service'
import useToastStore from '@/store/toastStore'

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({
            id,
            estadoHacia,
            motivo,
        }: {
            id: number
            estadoHacia: string
            motivo?: string | null
        }) => updateOrderStatus(id, estadoHacia, motivo),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['orders'] })
            useToastStore.getState().addToast('success', 'Estado del pedido actualizado')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al cambiar estado del pedido')
        },
    })
}
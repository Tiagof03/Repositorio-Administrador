import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPedido } from '@/features/cajero/services/cajero.service'
import type { PedidoCreatePayload } from '@/features/cajero/types'
import useToastStore from '@/store/toastStore'

export const useCreatePedido = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: PedidoCreatePayload) => createPedido(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['recent-orders'] })
            useToastStore.getState().addToast('success', 'Pedido creado correctamente')
        },
        onError: (error: unknown) => {
            const err = error as { response?: { data?: { detail?: string } } }
            const msg = err?.response?.data?.detail ?? 'Error al crear pedido'
            useToastStore.getState().addToast('error', msg)
        },
    })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProduct } from '@/features/products/services/products.service'
import type { ProductFormData } from '@/features/products/types'
import useToastStore from '@/store/toastStore'

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductFormData> }) =>
            updateProduct(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['products'] })
            useToastStore.getState().addToast('success', 'Producto actualizado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al actualizar producto')
        },
    })
}
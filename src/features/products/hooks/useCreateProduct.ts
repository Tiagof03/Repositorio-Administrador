import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct } from '@/features/products/services/products.service'
import type { ProductFormData } from '@/features/products/types'
import useToastStore from '@/store/toastStore'

export const useCreateProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: ProductFormData) => createProduct(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['products'] })
            useToastStore.getState().addToast('success', 'Producto creado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al crear producto')
        },
    })
}
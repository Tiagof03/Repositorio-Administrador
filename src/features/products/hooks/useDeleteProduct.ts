import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteProduct } from '@/features/products/services/products.service'
import useToastStore from '@/store/toastStore'

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['products'] })
            useToastStore.getState().addToast('success', 'Producto eliminado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al eliminar producto')
        },
    })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCategory } from '@/features/categorias/services/categories.service'
import useToastStore from '@/store/toastStore'

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['categories'] })
            useToastStore.getState().addToast('success', 'Categoría eliminada correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al eliminar categoría')
        },
    })
}
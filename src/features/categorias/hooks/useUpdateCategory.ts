import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCategory } from '@/features/categorias/services/categories.service'
import type { CategoryFormData } from '@/features/categorias/types'
import useToastStore from '@/store/toastStore'

export const useUpdateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<CategoryFormData> }) =>
            updateCategory(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['categories'] })
            useToastStore.getState().addToast('success', 'Categoría actualizada correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al actualizar categoría')
        },
    })
}
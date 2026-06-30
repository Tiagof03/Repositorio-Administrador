import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory } from '@/features/categorias/services/categories.service'
import type { CategoryFormData } from '@/features/categorias/types'
import useToastStore from '@/store/toastStore'

export const useCreateCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CategoryFormData) => createCategory(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['categories'] })
            useToastStore.getState().addToast('success', 'Categoría creada correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al crear categoría')
        },
    })
}
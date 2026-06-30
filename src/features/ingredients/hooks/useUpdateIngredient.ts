import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateIngredient } from '@/features/ingredients/services/ingredients.service'
import type { IngredientFormData } from '@/features/ingredients/types'
import useToastStore from '@/store/toastStore'

export const useUpdateIngredient = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<IngredientFormData> }) =>
            updateIngredient(id, payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['ingredients'] })
            useToastStore.getState().addToast('success', 'Ingrediente actualizado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al actualizar ingrediente')
        },
    })
}
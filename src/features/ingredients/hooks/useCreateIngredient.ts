import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createIngredient } from '@/features/ingredients/services/ingredients.service'
import type { IngredientFormData } from '@/features/ingredients/types'
import useToastStore from '@/store/toastStore'

export const useCreateIngredient = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: IngredientFormData) => createIngredient(payload),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['ingredients'] })
            useToastStore.getState().addToast('success', 'Ingrediente creado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al crear ingrediente')
        },
    })
}
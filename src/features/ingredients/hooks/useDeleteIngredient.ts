import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteIngredient } from '@/features/ingredients/services/ingredients.service'
import useToastStore from '@/store/toastStore'

export const useDeleteIngredient = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => deleteIngredient(id),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['ingredients'] })
            useToastStore.getState().addToast('success', 'Ingrediente eliminado correctamente')
        },
        onError: () => {
            useToastStore.getState().addToast('error', 'Error al eliminar ingrediente')
        },
    })
}
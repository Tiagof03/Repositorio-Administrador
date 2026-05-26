import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '@/features/ingredients/services/ingredients.service'
import type { Ingredient, IngredientFormData } from '@/features/ingredients/types'
export const useIngredients = () =>
  useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  })
export const useIngredient = (id: number) =>
  useQuery({
    queryKey: ['ingredients', id],
    queryFn: () => getIngredientById(id),
  })
export const useCreateIngredient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: IngredientFormData) => createIngredient(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
export const useUpdateIngredient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<IngredientFormData> }) =>
      updateIngredient(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
export const useDeleteIngredient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteIngredient(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
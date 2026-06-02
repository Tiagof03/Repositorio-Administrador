import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getIngredients,
  getIngredientById,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '@/features/ingredients/services/ingredients.service'
import type { Ingredient, IngredientFormData } from '@/features/ingredients/types'

export function useIngredients() {
  const queryClient = useQueryClient()
  const queryKey = ['ingredients']

  const getAll = useQuery({queryKey, queryFn: getIngredients})

  const getById = (id: number) => useQuery({queryKey: [...queryKey, id], queryFn: () => getIngredientById(id), enabled: id > 0})

  const create = useMutation({
    mutationFn: (payload: IngredientFormData) => createIngredient(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<IngredientFormData> }) =>
      updateIngredient(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })
  const remove = useMutation({
    mutationFn: (id: number) => deleteIngredient(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })

  return {
    ...getAll,
    getById,
    create,
    update,
    delete: remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending
  }
}
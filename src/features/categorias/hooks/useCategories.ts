import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Category, CategoryFormData } from '@/features/categorias/types'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/features/categorias/services/categories.service'

export function useCategories() {
  const queryClient = useQueryClient()
  const queryKey = ['categories']

  const getAll = useQuery({queryKey, queryFn: getCategories})

  const getById = (id: number) => useQuery({queryKey: [...queryKey, id], queryFn: () => getCategoryById(id), enabled: id > 0})

  const create = useMutation({
    mutationFn: (payload: CategoryFormData) => createCategory(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CategoryFormData> }) =>
      updateCategory(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })
  const remove = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
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
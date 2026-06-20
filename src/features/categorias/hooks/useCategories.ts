import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Category, CategoryFormData } from '@/features/categorias/types'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/features/categorias/services/categories.service'
import useToastStore from '@/store/toastStore'
const toast = useToastStore.getState
export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
export const useCategory = (id: number) =>
  useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategoryById(id),
  })
export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryFormData) => createCategory(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast().addToast('success', 'Categoría creada correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al crear categoría')
    },
  })
}
export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CategoryFormData> }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast().addToast('success', 'Categoría actualizada correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al actualizar categoría')
    },
  })
}
export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast().addToast('success', 'Categoría eliminada correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al eliminar categoría')
    },
  })
}
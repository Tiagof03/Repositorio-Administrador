import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductDisponible,
} from '@/features/products/services/products.service'
import type { Product, ProductFormData } from '@/features/products/types'

export function useProducts() {
  const queryClient = useQueryClient()
  const queryKey = ['products']

  const getAll = useQuery({queryKey, queryFn: getProducts})

  const getById = (id: number) => useQuery({queryKey: [...queryKey, id], queryFn: () => getProductById(id), enabled: id > 0})

  const create = useMutation({
    mutationFn: (payload: ProductFormData) => createProduct(payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductFormData> }) =>
      updateProduct(id, payload),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })
  const remove = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })

  const toggleDisponible = useMutation({
    mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
      toggleProductDisponible(id, disponible),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey })
  })

  return {
    ...getAll,
    getById,
    create,
    update,
    delete: remove,
    toggleDisponible,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
    isTogglingDisponible: toggleDisponible.isPending
  }
}
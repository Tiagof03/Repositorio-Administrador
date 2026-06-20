import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductDisponible,
} from '@/features/products/types'
import type { Product, ProductFormData } from '@/features/products/types'
import useToastStore from '@/store/toastStore'
const toast = useToastStore.getState
export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  })
export const useProduct = (id: number) =>
  useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id),
  })
export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductFormData) => createProduct(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      toast().addToast('success', 'Producto creado correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al crear producto')
    },
  })
}
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<ProductFormData> }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      toast().addToast('success', 'Producto actualizado correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al actualizar producto')
    },
  })
}
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      toast().addToast('success', 'Producto eliminado correctamente')
    },
    onError: () => {
      toast().addToast('error', 'Error al eliminar producto')
    },
  })
}
export const useToggleDisponible = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, disponible }: { id: number; disponible: boolean }) =>
      toggleProductDisponible(id, disponible),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] })
      toast().addToast('success', 'Disponibilidad actualizada')
    },
    onError: () => {
      toast().addToast('error', 'Error al actualizar disponibilidad')
    },
  })
}
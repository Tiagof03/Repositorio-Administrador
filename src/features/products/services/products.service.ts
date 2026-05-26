import api from '@/lib/axios'
import type { Product, ProductFormData } from '@/features/products/types'
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/productos/')
  return data
}
export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<Product>(`/productos/${id}`)
  return data
}
export const createProduct = async (payload: ProductFormData): Promise<Product> => {
  const { data } = await api.post<Product>('/productos/', payload)
  return data
}
export const updateProduct = async (
  id: number,
  payload: Partial<ProductFormData>,
): Promise<Product> => {
  const { data } = await api.patch<Product>(`/productos/${id}`, payload)
  return data
}
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
export const toggleProductDisponible = async (
  id: number,
  disponible: boolean,
): Promise<Product> => {
  const { data } = await api.patch<Product>(`/productos/${id}/disponibilidad`, { disponible })
  return data
}
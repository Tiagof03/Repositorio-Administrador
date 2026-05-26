import api from '@/lib/axios'
import type { Ingredient, IngredientFormData } from '@/features/ingredients/types'
export const getIngredients = async (): Promise<Ingredient[]> => {
  const { data } = await api.get<Ingredient[]>('/ingredientes/')
  return data
}
export const getIngredientById = async (id: number): Promise<Ingredient> => {
  const { data } = await api.get<Ingredient>(`/ingredientes/${id}`)
  return data
}
export const createIngredient = async (payload: IngredientFormData): Promise<Ingredient> => {
  const { data } = await api.post<Ingredient>('/ingredientes/', payload)
  return data
}
export const updateIngredient = async (
  id: number,
  payload: Partial<IngredientFormData>,
): Promise<Ingredient> => {
  const { data } = await api.patch<Ingredient>(`/ingredientes/${id}`, payload)
  return data
}
export const deleteIngredient = async (id: number): Promise<void> => {
  await api.delete(`/ingredientes/${id}`)
}
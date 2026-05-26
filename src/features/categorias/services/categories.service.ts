import api from '@/lib/axios'
import type { Category, CategoryFormData } from '@/features/categorias/types'
function buildTree(categories: Category[]): Category[] {
  const map = new Map<number, Category>()
  const roots: Category[] = []
  for (const cat of categories) {
    map.set(cat.id, { ...cat, hijos: [] })
  }
  for (const cat of map.values()) {
    if (cat.parent_id !== null && map.has(cat.parent_id)) {
      map.get(cat.parent_id)!.hijos!.push(cat)
    } else if (cat.parent_id === null) {
      roots.push(cat)
    }
  }
  return roots.sort((a, b) => a.id - b.id)
}
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<Category[]>('/categorias/', {
    params: { limit: 100 },
  })
  return buildTree(data)
}
export const getCategoryById = async (id: number): Promise<Category> => {
  const { data } = await api.get<Category>(`/categorias/${id}`)
  return data
}
export const createCategory = async (payload: CategoryFormData): Promise<Category> => {
  const { data } = await api.post<Category>('/categorias/', payload)
  return data
}
export const updateCategory = async (
  id: number,
  payload: Partial<CategoryFormData>,
): Promise<Category> => {
  const { data } = await api.patch<Category>(`/categorias/${id}`, payload)
  return data
}
export const deleteCategory = async (id: number): Promise<void> => {
  await api.delete(`/categorias/${id}`)
}
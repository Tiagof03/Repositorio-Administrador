export interface Category {
  id: number
  parent_id: number | null
  nombre: string
  descripcion?: string
  imagen_url?: string
  hijos?: Category[]
}
export interface CategoryFormData {
  parent_id: number | null
  nombre: string
  descripcion?: string
  imagen_url?: string
}
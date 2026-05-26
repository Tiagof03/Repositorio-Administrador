export interface Ingredient {
  id: number
  nombre: string
  es_alergeno: boolean
  descripcion: string
}

export interface IngredientFormData {
  nombre: string
  es_alergeno: boolean
  descripcion: string
}

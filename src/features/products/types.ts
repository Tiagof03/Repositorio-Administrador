export interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precioBase: number
  imagenesUrl: string[]
  stockCantidad: number
  disponible: boolean
  unidadVentaId: number | null
}

export interface IngredientWithRemovable {
  id: number
  nombre: string
  esAlergeno: boolean
  esRemovible: boolean
}

export interface ProductDetail extends Product {
  categorias: { id: number; nombre: string; esPrincipal: boolean }[]
  ingredientes: IngredientWithRemovable[]
}

export interface ProductFormData {
  nombre: string
  descripcion: string | null
  precioBase: number
  imagenesUrl: string[]
  stockCantidad: number
  disponible: boolean
  unidadVentaId: number | null
  categorias: { categoriaId: number; esPrincipal: boolean }[]
  ingredientes: { ingredienteId: number; cantidad: number; unidadMedidaId: number; esRemovible: boolean }[]
}

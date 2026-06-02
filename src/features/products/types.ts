export interface Product {
  id: number
  nombre: string
  descripcion: string
  precioBase: number
  imagenesUrl: string[]
  stockCantidad: number
  disponible: boolean
  unidadVentaId: number
  cuantoPesa?: number
}

export interface ProductFormData {
  nombre: string
  descripcion?: string
  precioBase: number
  imagenesUrl: string[]
  stockCantidad: number
  disponible: boolean
  unidadVentaId: number | null
  cuantoPesa?: number
  categorias: Array<{
    categoriaId: number
    esPrincipal: boolean
  }>
  ingredientes: Array<{
    ingredienteId: number
    cantidad: number
    unidadMedidaId: number
    esRemovible: boolean
  }>
}
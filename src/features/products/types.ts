import api from '@/lib/axios'
import type { Product, ProductFormData } from '@/features/products/types'
function toSnakeCase(payload: ProductFormData) {
  return {
    nombre: payload.nombre,
    descripcion: payload.descripcion,
    precio_base: payload.precioBase,
    imagenes_url: payload.imagenesUrl,
    stock_cantidad: payload.stockCantidad,
    disponible: payload.disponible,
    unidad_venta_id: payload.unidadVentaId,
    cuanto_pesa: payload.cuantoPesa,
    categorias: payload.categorias.map((c) => ({
      categoria_id: c.categoriaId,
      es_principal: c.esPrincipal,
    })),
    ingredientes: payload.ingredientes.map((i) => ({
      ingrediente_id: i.ingredienteId,
      cantidad: i.cantidad,
      unidad_medida_id: i.unidadMedidaId,
      es_removible: i.esRemovible,
    })),
  }
}
function toCamelCase(data: any): Product {
  return {
    id: data.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    precioBase: data.precio_base,
    imagenesUrl: data.imagenes_url ?? [],
    stockCantidad: data.stock_cantidad,
    disponible: data.disponible,
    unidadVentaId: data.unidad_venta_id,
    cuantoPesa: data.cuanto_pesa,
  } as Product
}
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<any[]>('/productos/')
  return data.map(toCamelCase)
}
export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await api.get<any>(`/productos/${id}`)
  return toCamelCase(data)
}
export const createProduct = async (payload: ProductFormData): Promise<Product> => {
  const { data } = await api.post<any>('/productos/', toSnakeCase(payload))
  return toCamelCase(data)
}
export const updateProduct = async (
  id: number,
  payload: Partial<ProductFormData>,
): Promise<Product> => {
  const snakePayload = payload.categorias !== undefined || payload.ingredientes !== undefined
    ? toSnakeCase(payload as ProductFormData)
    : {
        nombre: payload.nombre,
        descripcion: payload.descripcion,
        precio_base: (payload as any).precioBase,
        imagenes_url: (payload as any).imagenesUrl,
        stock_cantidad: (payload as any).stockCantidad,
        disponible: payload.disponible,
        unidad_venta_id: (payload as any).unidadVentaId,
      }
  const { data } = await api.patch<any>(`/productos/${id}`, snakePayload)
  return toCamelCase(data)
}
export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/productos/${id}`)
}
export const toggleProductDisponible = async (
  id: number,
  disponible: boolean,
): Promise<Product> => {
  const { data } = await api.patch<any>(`/productos/${id}/disponibilidad`, { disponible })
  return toCamelCase(data)
}
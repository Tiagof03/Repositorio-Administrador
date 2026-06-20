import api from '@/lib/axios'

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

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  pages: number
}

function toSnakeCase(payload: ProductFormData) {
  return {
    nombre: payload.nombre,
    descripcion: payload.descripcion,
    precio_base: payload.precioBase,
    imagenes_url: payload.imagenesUrl,
    stock_cantidad: payload.stockCantidad,
    disponible: payload.disponible,
    unidad_venta_id: payload.unidadVentaId,
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
  }
}

export const getProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<PaginatedResponse<any>>('/productos/')
  return data.items.map(toCamelCase)
}

export const getProductById = async (id: number): Promise<ProductDetail> => {
  const { data } = await api.get<any>(`/productos/${id}`)
  return {
    ...toCamelCase(data),
    categorias: (data.categorias ?? []).map((c: any) => ({
      id: c.id,
      nombre: c.nombre,
      esPrincipal: c.es_principal ?? false,
    })),
    ingredientes: (data.ingredientes ?? []).map((i: any) => ({
      id: i.id,
      nombre: i.nombre,
      esAlergeno: i.es_alergeno ?? false,
      esRemovible: i.es_removible ?? false,
    })),
  }
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
  const { data } = await api.put<any>(`/productos/${id}`, snakePayload)
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

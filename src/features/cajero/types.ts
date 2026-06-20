export interface IngredientePersonalizado {
  id: number
  nombre: string
  es_alergeno: boolean
  es_removible: boolean
}
export interface CajeroProduct {
  id: number
  nombre: string
  descripcion: string | null
  precioBase: number
  imagenesUrl: string[]
  stockCantidad: number
  disponible: boolean
}
export interface CartItem {
  id: number
  nombre: string
  precioBase: number
  cantidad: number
  imagenesUrl: string[]
  personalizacion: number[] | null
}
export interface FormaPago {
  codigo: string
  descripcion: string
  habilitado: boolean
}
export interface PedidoItemRequest {
  producto_id: number
  cantidad: number
  personalizacion: number[] | null
}
export interface PedidoCreatePayload {
  direccion_id?: number | null
  forma_pago_codigo: string
  nombre_para?: string | null
  notas: string | null
  items: PedidoItemRequest[]
}
export interface DetallePedidoOut {
  pedido_id: number
  producto_id: number
  cantidad: number
  nombre_snapshot: string
  precio_snapshot: number
  subtotal_snap: number
}
export interface PedidoOut {
  id: number
  usuario_id: number
  estado_codigo: string
  forma_pago_codigo: string
  nombre_para: string | null
  subtotal: number
  descuento: number
  costo_envio: number
  total: number
  notas: string | null
  created_at: string
  detalles: DetallePedidoOut[]
}
export function toCamelCaseProduct(data: any): CajeroProduct {
  return {
    id: data.id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    precioBase: data.precio_base ?? 0,
    imagenesUrl: data.imagenes_url ?? [],
    stockCantidad: data.stock_cantidad ?? 0,
    disponible: data.disponible ?? true,
  }
}
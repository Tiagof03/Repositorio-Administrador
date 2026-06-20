export interface Direccion {
  id: number
  alias: string
  linea1: string
  linea2: string
  ciudad: string
  provincia: string
  codigoPostal: string
  latitud: number
  longitud: number
  esPrincipal: boolean
}

export const ORDER_STATUSES = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREP',
  'ENTREGADO',
  'CANCELADO',
] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]
export const STATUS_FLOW: OrderStatus[] = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREP',
  'ENTREGADO',
]
export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En Preparación',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}
export const STATUS_ICONS: Record<OrderStatus, string> = {
  PENDIENTE: 'schedule',
  CONFIRMADO: 'contract_edit',
  EN_PREP: 'outdoor_grill',
  ENTREGADO: 'check_circle',
  CANCELADO: 'cancel',
}
export const FORMA_PAGO_LABELS: Record<string, string> = {
  EFECTIVO: 'Efectivo',
  MERCADOPAGO: 'Mercado Pago',
  TRANSFERENCIA: 'Transferencia',
}
export interface OrderItem {
  productoId: number
  nombreSnapshot: string
  cantidad: number
  precioSnapshot: number
  subtotalSnap: number
  personalizacion: number[] | null
  personalizacionNombres: string[] | null
}
export interface HistorialEntry {
  estadoDesde: string | null
  estadoHacia: string
  usuarioId: number | null
  motivo: string | null
  createdAt: string
}
export interface Order {
  id: number
  usuarioId: number
  clienteNombre: string
  direccionId: number | null
  estadoCodigo: OrderStatus
  formaPagoCodigo: string
  items: OrderItem[]
  subtotal: number
  descuento: number
  costoEnvio: number
  total: number
  notas: string | null
  creadoEn: string
  historial: HistorialEntry[]
}
export function toCamelCaseOrder(data: any): Order {
  return {
    id: data.id,
    usuarioId: data.usuario_id,
    clienteNombre: '',
    nombrePara: data.nombre_para ?? null, 
    direccionId: data.direccion_id,
    estadoCodigo: data.estado_codigo,
    formaPagoCodigo: data.forma_pago_codigo,
    subtotal: data.subtotal,
    descuento: data.descuento,
    costoEnvio: data.costo_envio,
    total: data.total,
    notas: data.notas,
    creadoEn: data.created_at,
    items: (data.detalles ?? []).map((d: any) => ({
      productoId: d.producto_id,
      nombreSnapshot: d.nombre_snapshot,
      cantidad: d.cantidad,
      precioSnapshot: d.precio_snapshot,
      subtotalSnap: d.subtotal_snap,
      personalizacion: d.personalizacion,
      personalizacionNombres: d.personalizacion_nombres ?? null,
    })),
    historial: (data.historial ?? []).map((h: any) => ({
      estadoDesde: h.estado_desde,
      estadoHacia: h.estado_hacia,
      usuarioId: h.usuario_id,
      motivo: h.motivo,
      createdAt: h.created_at,
    })),
  }
}
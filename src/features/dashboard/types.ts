export interface EstadoCount {
  estado: string
  cantidad: number
}

export interface ProductoVendido {
  nombre: string
  totalVendido: number
}

export interface PedidoReciente {
  id: number
  usuarioEmail: string
  total: number
  estadoCodigo: string
  createdAt: string
}

export interface FormaPagoTotal {
  formaPago: string
  total: number
}

export interface DashboardResponse {
  totalPedidos: number
  ingresosTotales: number
  pedidosPorEstado: EstadoCount[]
  productosMasVendidos: ProductoVendido[]
  pedidosRecientes: PedidoReciente[]
  totalPorFormaPago: FormaPagoTotal[]
}

export function toCamelCaseDashboard(raw: any): DashboardResponse {
  return {
    totalPedidos: raw.total_pedidos,
    ingresosTotales: raw.ingresos_totales,
    pedidosPorEstado: (raw.pedidos_por_estado ?? []).map((e: any) => ({
      estado: e.estado,
      cantidad: e.cantidad,
    })),
    productosMasVendidos: (raw.productos_mas_vendidos ?? []).map((p: any) => ({
      nombre: p.nombre,
      totalVendido: p.total_vendido,
    })),
    pedidosRecientes: (raw.pedidos_recientes ?? []).map((p: any) => ({
      id: p.id,
      usuarioEmail: p.usuario_email,
      total: p.total,
      estadoCodigo: p.estado_codigo,
      createdAt: p.created_at,
    })),
    totalPorFormaPago: (raw.total_por_forma_pago ?? []).map((f: any) => ({
      formaPago: f.forma_pago,
      total: f.total,
    })),
  }
}

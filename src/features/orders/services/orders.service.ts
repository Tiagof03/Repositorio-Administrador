import api from '@/lib/axios'
import { toCamelCaseOrder } from '@/features/orders/types'
import type { Direccion, Order } from '@/features/orders/types'

interface PaginatedOrders {
  items: any[]
  total: number
  page: number
  size: number
  pages: number
}

export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<PaginatedOrders>('/pedidos/')
  return data.items.map(toCamelCaseOrder)
}

export const getOrderById = async (id: number): Promise<Order> => {
  const { data } = await api.get<any>(`/pedidos/${id}`)
  return toCamelCaseOrder(data)
}

export const getAdminDireccion = async (id: number): Promise<Direccion> => {
  const { data } = await api.get<Direccion>(`/admin/direcciones/${id}`)
  return data
}

export const updateOrderStatus = async (
  id: number,
  estadoHacia: string,
  motivo?: string | null,
): Promise<Order> => {
  const { data } = await api.patch<any>(`/pedidos/${id}/estado`, {
    estado_hacia: estadoHacia,
    motivo: motivo ?? null,
  })
  return toCamelCaseOrder(data)
}

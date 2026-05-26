import api from '@/lib/axios'
import { toCamelCaseOrder } from '@/features/orders/types'
import type { Order } from '@/features/orders/types'
export const getOrders = async (): Promise<Order[]> => {
  const { data } = await api.get<any[]>('/pedidos/')
  return data.map(toCamelCaseOrder)
}
export const getOrderById = async (id: number): Promise<Order> => {
  const { data } = await api.get<any>(`/pedidos/${id}`)
  return toCamelCaseOrder(data)
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
import api from '@/lib/axios'
import { toCamelCaseProduct, type CajeroProduct, type FormaPago, type IngredientePersonalizado, type PedidoCreatePayload, type PedidoOut } from '@/features/cajero/types'

interface PaginatedProducts {
  items: any[]
  total: number
  page: number
  size: number
  pages: number
}

interface PaginatedOrders {
  items: any[]
  total: number
  page: number
  size: number
  pages: number
}

export const getProducts = async (): Promise<CajeroProduct[]> => {
  const { data } = await api.get<PaginatedProducts>('/productos/', {
    params: { disponible: true, size: 100 },
  })
  return data.items.map(toCamelCaseProduct)
}

export const getFormasPago = async (): Promise<FormaPago[]> => {
  const { data } = await api.get<FormaPago[]>('/formas-pago/')
  return data.filter((fp) => fp.habilitado)
}

export const createPedido = async (payload: PedidoCreatePayload): Promise<PedidoOut> => {
  const { data } = await api.post<PedidoOut>('/pedidos/', payload)
  return data
}

export const getRecentOrders = async (): Promise<PedidoOut[]> => {
  const { data } = await api.get<PaginatedOrders>('/pedidos/')
  return data.items.slice(0, 10)
}

export const getProductIngredients = async (productId: number): Promise<IngredientePersonalizado[]> => {
  const { data } = await api.get<IngredientePersonalizado[]>(`/productos/${productId}/ingredientes`)
  return data
}

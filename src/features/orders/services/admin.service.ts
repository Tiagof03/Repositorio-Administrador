import api from '@/lib/axios'
import type { Order } from '@/features/orders/types'
interface AdminUser {
  id: number
  nombre: string
  apellido: string
}
const userCache = new Map<number, string>()
export async function getNombreCliente(userId: number): Promise<string> {
  if (userCache.has(userId)) return userCache.get(userId)!
  try {
    const { data } = await api.get<AdminUser>(`/usuarios/${userId}`)
    const nombre = `${data.nombre} ${data.apellido}`.trim()
    userCache.set(userId, nombre)
    return nombre
  } catch {
    const fallback = `Usuario #${userId}`
    userCache.set(userId, fallback)
    return fallback
  }
}
export function hydrateClientNames(
  orders: Order[],
  resolved: Map<number, string>,
): Order[] {
  return orders.map((o) => ({
    ...o,
    clienteNombre: resolved.get(o.usuarioId) ?? `Usuario #${o.usuarioId}`,
  }))
}

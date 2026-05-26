import { useEffect, useState, useRef } from 'react'
import { getNombreCliente } from '@/features/orders/services/admin.service'
import type { Order } from '@/features/orders/types'
export function useClientNames(orders: Order[] | undefined) {
  const [map, setMap] = useState<Map<number, string>>(new Map())
  const fetchingRef = useRef<Set<number>>(new Set())
  useEffect(() => {
    if (!orders || orders.length === 0) return
    const ids = new Set(orders.map((o) => o.usuarioId))
    const toFetch: number[] = []
    ids.forEach((id) => {
      if (!map.has(id) && !fetchingRef.current.has(id)) {
        toFetch.push(id)
      }
    })
    if (toFetch.length === 0) return
    toFetch.forEach((id) => fetchingRef.current.add(id))
    Promise.all(toFetch.map(async (id) => {
      const name = await getNombreCliente(id)
      return [id, name] as const
    })).then((entries) => {
      setMap((prev) => {
        const next = new Map(prev)
        entries.forEach(([id, name]) => next.set(id, name))
        return next
      })
    })
  }, [orders, map])
  return map
}
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '@/features/orders/services/orders.service'

export function useOrders() {
  const queryClient = useQueryClient()
  const queryKey = ['orders']

  const getAll = useQuery({queryKey, queryFn: getOrders})

  const getById = (id: number) => useQuery({queryKey: [...queryKey, id], queryFn: () => getOrderById(id), enabled: id > 0})

  const updateStatus = useMutation({
    mutationFn: ({
      id, estadoHacia, motivo
    }: {
      id: number
      estadoHacia: string
      motivo?: string | null
    }) => updateOrderStatus(id, estadoHacia, motivo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    ...getAll,
    getById,
    updateStatus,
    isUpdatingStatus: updateStatus.isPending
  }
}
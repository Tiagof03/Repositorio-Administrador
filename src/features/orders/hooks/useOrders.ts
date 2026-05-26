import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '@/features/orders/services/orders.service'
export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  })
export const useOrder = (id: number) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id),
    enabled: id > 0,
  })
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      estadoHacia,
      motivo,
    }: {
      id: number
      estadoHacia: string
      motivo?: string | null
    }) => updateOrderStatus(id, estadoHacia, motivo),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
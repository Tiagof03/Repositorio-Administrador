import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getOrders,
  getOrderById,
  getAdminDireccion,
  updateOrderStatus,
} from '@/features/orders/services/orders.service'
import useToastStore from '@/store/toastStore'
const toast = useToastStore.getState
export const useOrders = () =>
  useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
    refetchInterval: 30_000,
  })
export const useOrder = (id: number) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrderById(id),
    enabled: id > 0,
  })
export const useAdminDireccion = (direccionId: number | null) =>
  useQuery({
    queryKey: ['admin-direccion', direccionId],
    queryFn: () => getAdminDireccion(direccionId!),
    enabled: !!direccionId,
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
      toast().addToast('success', 'Estado del pedido actualizado')
    },
    onError: () => {
      toast().addToast('error', 'Error al cambiar estado del pedido')
    },
  })
}
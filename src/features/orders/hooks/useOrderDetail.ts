import { useQuery } from '@tanstack/react-query'
import { getOrderById } from '@/features/orders/services/orders.service'

export const useOrder = (id: number) =>
    useQuery({
        queryKey: ['orders', id],
        queryFn: () => getOrderById(id),
        enabled: id > 0,
    })

import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/features/orders/services/orders.service'

export const useOrders = () =>
    useQuery({
        queryKey: ['orders'],
        queryFn: getOrders,
        refetchInterval: 30_000,
    })
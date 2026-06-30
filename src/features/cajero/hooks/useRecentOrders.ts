import { useQuery } from '@tanstack/react-query'
import { getRecentOrders } from '@/features/cajero/services/cajero.service'

export const useRecentOrders = () =>
    useQuery({
        queryKey: ['recent-orders'],
        queryFn: getRecentOrders,
        refetchInterval: 15_000,
    })
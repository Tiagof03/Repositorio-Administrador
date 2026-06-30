import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/cajero/services/cajero.service'

export const useCajeroProducts = () =>
    useQuery({
        queryKey: ['cajero-products'],
        queryFn: getProducts,
    })

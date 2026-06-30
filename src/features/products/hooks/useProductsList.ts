import { useQuery } from '@tanstack/react-query'
import { getProducts } from '@/features/products/services/products.service'

export const useProducts = () =>
    useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    })
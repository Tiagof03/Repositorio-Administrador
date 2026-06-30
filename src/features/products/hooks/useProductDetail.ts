import { useQuery } from '@tanstack/react-query'
import { getProductById } from '@/features/products/services/products.service'

export const useProduct = (id: number) =>
    useQuery({
        queryKey: ['products', id],
        queryFn: () => getProductById(id),
    })
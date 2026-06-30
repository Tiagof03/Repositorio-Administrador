import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/features/categorias/services/categories.service'

export const useCategories = () =>
    useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
    })

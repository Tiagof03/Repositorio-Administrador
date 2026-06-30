import { useQuery } from '@tanstack/react-query'
import { getCategoryById } from '@/features/categorias/services/categories.service'

export const useCategory = (id: number) =>
    useQuery({
        queryKey: ['categories', id],
        queryFn: () => getCategoryById(id),
    })
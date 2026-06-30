import { useQuery } from '@tanstack/react-query'
import { getIngredients } from '@/features/ingredients/services/ingredients.service'

export const useIngredients = () =>
    useQuery({
        queryKey: ['ingredients'],
        queryFn: getIngredients,
    })
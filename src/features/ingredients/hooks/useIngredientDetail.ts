import { useQuery } from '@tanstack/react-query'
import { getIngredientById } from '@/features/ingredients/services/ingredients.service'

export const useIngredient = (id: number) =>
    useQuery({
        queryKey: ['ingredients', id],
        queryFn: () => getIngredientById(id),
    })
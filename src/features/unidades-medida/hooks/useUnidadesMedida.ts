import { useQuery } from '@tanstack/react-query'
import { getUnidadesMedida } from '@/features/unidades-medida/services/unidades-medida.service'
export const useUnidadesMedida = () =>
  useQuery({
    queryKey: ['unidades-medida'],
    queryFn: getUnidadesMedida,
  })
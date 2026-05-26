import api from '@/lib/axios'
import type { UnidadMedida } from '@/features/unidades-medida/types'
export const getUnidadesMedida = async (): Promise<UnidadMedida[]> => {
  const { data } = await api.get<UnidadMedida[]>('/unidades-medida/')
  return data
}

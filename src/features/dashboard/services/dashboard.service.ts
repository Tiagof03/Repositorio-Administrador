import api from '@/lib/axios'
import type { DashboardResponse } from '@/features/dashboard/types'
import { toCamelCaseDashboard } from '@/features/dashboard/types'

export const getDashboardResumen = async (): Promise<DashboardResponse> => {
  const { data } = await api.get<any>('/admin/dashboard')
  return toCamelCaseDashboard(data)
}

import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/features/admin-users/services/admin-users.service'

export const useAdminUsers = (params?: { page?: number; size?: number; rol?: string }) =>
    useQuery({
        queryKey: ['admin-users', params],
        queryFn: () => getUsers(params),
    })
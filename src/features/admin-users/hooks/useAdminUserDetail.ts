import { useQuery } from '@tanstack/react-query'
import { getUserById } from '@/features/admin-users/services/admin-users.service'

export const useAdminUser = (id: number) =>
    useQuery({
        queryKey: ['admin-users', id],
        queryFn: () => getUserById(id),
        enabled: id > 0,
    })
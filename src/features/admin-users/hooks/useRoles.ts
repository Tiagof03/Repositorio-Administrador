import { useQuery } from '@tanstack/react-query'
import { getRoles } from '@/features/admin-users/services/admin-users.service'

export const useRoles = () =>
    useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    })
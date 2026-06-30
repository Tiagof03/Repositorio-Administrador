import { useQuery } from '@tanstack/react-query'
import { getAdminDireccion } from '@/features/orders/services/orders.service'

export const useAdminDireccion = (direccionId: number | null) =>
    useQuery({
        queryKey: ['admin-direccion', direccionId],
        queryFn: () => getAdminDireccion(direccionId!),
        enabled: !!direccionId,
    })

import { useQuery } from '@tanstack/react-query'
import { getFormasPago } from '@/features/cajero/services/cajero.service'

export const useFormasPago = () =>
    useQuery({
        queryKey: ['formas-pago'],
        queryFn: getFormasPago,
    })
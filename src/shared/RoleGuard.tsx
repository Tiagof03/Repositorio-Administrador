import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

interface Props {
  allowedRoles: string[]
  children: React.ReactNode
}

export default function RoleGuard({ allowedRoles, children }: Props) {
  const rol = useAuthStore((s) => s.rol)
  if (!rol || !allowedRoles.includes(rol))
    return <Navigate to="/productos" replace />
  return <>{children}</>
}

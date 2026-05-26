import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

const VALID_ROLES = ['admin', 'empleado', 'cajero'] as const

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const rol = useAuthStore((s) => s.rol)
  const logout = useAuthStore((s) => s.logout)

  if (!token || !rol || !VALID_ROLES.includes(rol)) {
    logout()
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
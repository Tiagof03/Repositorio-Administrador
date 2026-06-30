import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

const VALID_ROLES = ['admin', 'pedidos', 'cajero', 'stock'] as const

export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  const rol = useAuthStore((s) => s.rol)
  const logout = useAuthStore((s) => s.logout)

  if (!token || !rol) {
    logout()
    return <Navigate to="/login" replace />
  }

  if (!VALID_ROLES.includes(rol as typeof VALID_ROLES[number])) {
    if (rol === 'cliente') {
      window.location.href = 'http://localhost:5174'
      return null
    }
    logout()
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
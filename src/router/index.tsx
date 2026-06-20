import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/shared/Layout'
import ProtectedRoute from '@/shared/ProtectedRoute'
import RoleGuard from '@/shared/RoleGuard'
import NotFoundPage from '@/shared/NotFoundPage'
import CajeroPage from '@/features/cajero/page/CajeroPage'
import DashboardPage from '@/features/dashboard/page/DashboardPage'
import LoginPage from '@/features/auth/page/LoginPage'
import ProductosPage from '@/features/products/page/ProductosPage'
import DetalleProductoPage from '@/features/products/page/DetalleProductoPage'
import IngredientesPage from '@/features/ingredients/page/IngredientesPage'
import CategoriasPage from '@/features/categorias/page/CategoriasPage'
import PedidosPage from '@/features/orders/page/PedidosPage'
import RegisterPage from '@/features/auth/page/RegisterPage'
import AdminUsersPage from '@/features/admin-users/page/AdminUsersPage'
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <Navigate to="/productos" replace />,
          },
          {
            path: 'dashboard',
            element: <RoleGuard allowedRoles={['admin']}><DashboardPage /></RoleGuard>,
          },
          {
            path: 'productos',
            element: <RoleGuard allowedRoles={['admin', 'stock']}><ProductosPage /></RoleGuard>,
          },
          {
            path: 'productos/:id',
            element: <RoleGuard allowedRoles={['admin', 'stock']}><DetalleProductoPage /></RoleGuard>,
          },
          {
            path: 'ingredientes',
            element: <RoleGuard allowedRoles={['admin', 'stock']}><IngredientesPage /></RoleGuard>,
          },
          {
            path: 'categorias',
            element: <RoleGuard allowedRoles={['admin']}><CategoriasPage /></RoleGuard>,
          },
          {
            path: 'pedidos',
            element: <RoleGuard allowedRoles={['admin', 'empleado']}><PedidosPage /></RoleGuard>,
          },
          {
            path: 'cajero',
            element: <RoleGuard allowedRoles={['admin', 'cajero']}><CajeroPage /></RoleGuard>,
          },
          {
            path: 'admin/usuarios',
            element: <RoleGuard allowedRoles={['admin']}><AdminUsersPage /></RoleGuard>,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])


export default router

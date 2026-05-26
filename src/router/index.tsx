import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '@/shared/Layout'
import ProtectedRoute from '@/shared/ProtectedRoute'
import LoginPage from '@/features/auth/page/LoginPage'
import ProductosPage from '@/features/products/page/ProductosPage'
import IngredientesPage from '@/features/ingredients/page/IngredientesPage'
import CategoriasPage from '@/features/categorias/page/CategoriasPage'
import PedidosPage from '@/features/orders/page/PedidosPage'
import RegisterPage from '@/features/auth/page/RegisterPage'
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
            path: 'productos',
            element: <ProductosPage />,
          },
          {
            path: 'ingredientes',
            element: <IngredientesPage />,
          },
          {
            path: 'categorias',
            element: <CategoriasPage />,
          },
          {
            path: 'pedidos',
            element: <PedidosPage />,
          },
        ],
      },
    ],
  },
])


export default router

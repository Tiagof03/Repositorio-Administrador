import { NavLink } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/productos', icon: 'restaurant_menu', label: 'Products' },
  { to: '/ingredientes', icon: 'kitchen', label: 'Ingredients' },
  { to: '/categorias', icon: 'category', label: 'Categories' },
  { to: '/pedidos', icon: 'receipt_long', label: 'Orders' },
  { to: '/cajero', icon: 'point_of_sale', label: 'Cajero' },
  { to: '/admin/usuarios', icon: 'group', label: 'Usuarios', adminOnly: true  }, 
]

const baseLink =
  'flex items-center gap-4 py-3 px-6 font-label-md text-label-md transition-all active:scale-95'
const activeLink = `${baseLink} text-primary border-r-4 border-primary bg-primary/5`
const inactiveLink = `${baseLink} text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high`

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const rol = useAuthStore((s) => s.rol)
  const isAdmin = rol === 'admin'
  const isStock = rol === 'stock'
  const isPedidos = rol === 'pedidos'
  const isCajero = rol === 'cajero'

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false
    if (isStock && item.to !== '/productos' && item.to !== '/ingredientes') return false
    if (isPedidos && item.to !== '/pedidos') return false
    if (isCajero && item.to !== '/cajero') return false
    return true
  })

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container border-r border-outline-variant/20 flex flex-col py-stack-lg gap-stack-md z-50">
      <div className="px-6 mb-8">
        <div className="mb-2">
          <div>
            <h1 className="text-headline-md font-bold text-primary uppercase tracking-tighter">
              Food Store
            </h1>
            <p className="text-label-sm text-on-surface-variant/70 uppercase tracking-widest">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-0">
        {visibleItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? activeLink : inactiveLink)}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto border-t border-outline-variant/10">
        {user && (
          <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-high flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant">person</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-label-md font-bold text-on-surface truncate">{user.nombre} {user.apellido}</p>
              <p className="text-label-xs text-on-surface-variant/60 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <div className="pt-4">
        
        <button
          onClick={logout}
          className={`${inactiveLink} w-full text-left`}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
        </div>
      </div>
    </aside>
  )
}

import { NavLink } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'

const navItems = [
  { to: '/productos', icon: 'restaurant_menu', label: 'Products' },
  { to: '/ingredientes', icon: 'kitchen', label: 'Ingredients' },
  { to: '/categorias', icon: 'category', label: 'Categories' },
  { to: '/pedidos', icon: 'receipt_long', label: 'Orders' },
]

const baseLink =
  'flex items-center gap-4 py-3 px-6 font-label-md text-label-md transition-all active:scale-95'
const activeLink = `${baseLink} text-primary border-r-4 border-primary bg-primary/5`
const inactiveLink = `${baseLink} text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high`

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface-container border-r border-outline-variant/20 flex flex-col py-stack-lg gap-stack-md z-50">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary-container flex items-center justify-center">
            <span
              className="material-symbols-outlined text-on-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              restaurant
            </span>
          </div>
          <div>
            <h1 className="text-headline-md font-extrabold text-primary uppercase tracking-tighter">
              FoodStore Admin
            </h1>
            <p className="text-label-sm text-on-surface-variant/70 uppercase tracking-widest">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col px-0">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? activeLink : inactiveLink)}
          >
            <span className="material-symbols-outlined">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-outline-variant/10 pt-4">
        <a
          href="#"
          className={inactiveLink}
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
        <button
          onClick={logout}
          className={`${inactiveLink} w-full text-left`}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}

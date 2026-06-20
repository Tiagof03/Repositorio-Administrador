import { useState, useEffect } from 'react'
import type { AdminUser, Rol } from '@/features/admin-users/types'
interface RolesModalProps {
  user: AdminUser
  allRoles: Rol[]
  onSubmit: (roles: string[]) => void
  onClose: () => void
  isSubmitting: boolean
}
export default function RolesModal({ user, allRoles, onSubmit, onClose, isSubmitting }: RolesModalProps) {
  const [selected, setSelected] = useState<string>('')
  useEffect(() => {
    setSelected(user.roles[0] ?? '')
  }, [user])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    onSubmit([selected])
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border-l border-outline-variant/20 h-full overflow-y-auto flex flex-col animate-slide-in">
        <div className="sticky top-0 bg-surface-container z-10 flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <h3 className="text-headline-sm text-on-surface font-bold">Roles de Usuario</h3>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/10">
            <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[24px]">badge</span>
            </div>
            <div>
              <p className="text-body-md text-on-surface font-medium">{user.nombre} {user.apellido}</p>
              <p className="text-label-sm text-on-surface-variant">{user.email}</p>
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {allRoles.length === 0 ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-container-high h-12 w-full" />
                ))}
              </div>
            ) : (
              allRoles.map((rol) => (
                <label
                  key={rol.codigo}
                  className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-all ${
                    selected === rol.codigo
                      ? 'bg-primary/5 border-primary/30'
                      : 'border-outline-variant/10 hover:bg-surface-container-high'
                  }`}
                >
                  <input
                    type="radio"
                    name="rol"
                    checked={selected === rol.codigo}
                    onChange={() => setSelected(rol.codigo)}
                    className="accent-primary w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="text-body-md text-on-surface font-medium">{rol.nombre}</p>
                    {rol.descripcion && (
                      <p className="text-label-sm text-on-surface-variant/60">{rol.descripcion}</p>
                    )}
                  </div>
                  <span className="text-label-sm text-on-surface-variant/40 uppercase">{rol.codigo}</span>
                </label>
              ))
            )}
          </div>
          <div className="sticky bottom-0 bg-surface-container flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant text-label-md font-bold hover:bg-surface-container-high transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary-container text-on-primary-container text-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Guardando...
                </>
              ) : (
                'Guardar Roles'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
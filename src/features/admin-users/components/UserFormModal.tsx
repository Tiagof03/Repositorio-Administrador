import { useState, useEffect } from 'react'
import type { AdminUser, AdminUserUpdate } from '@/features/admin-users/types'
interface UserFormModalProps {
  user: AdminUser
  onSubmit: (payload: AdminUserUpdate) => void
  onClose: () => void
  isSubmitting: boolean
}
export default function UserFormModal({ user, onSubmit, onClose, isSubmitting }: UserFormModalProps) {
  const [nombre, setNombre] = useState(user.nombre)
  const [apellido, setApellido] = useState(user.apellido)
  const [celular, setCelular] = useState(user.celular ?? '')
  useEffect(() => {
    setNombre(user.nombre)
    setApellido(user.apellido)
    setCelular(user.celular ?? '')
  }, [user])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ nombre: nombre.trim() || null, apellido: apellido.trim() || null, celular: celular.trim() || null })
  }
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-surface-container border-l border-outline-variant/20 h-full overflow-y-auto flex flex-col animate-slide-in">
        <div className="sticky top-0 bg-surface-container z-10 flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <h3 className="text-headline-sm text-on-surface font-bold">Editar Usuario</h3>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-on-surface transition-all cursor-pointer">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-outline-variant/10">
            <div className="w-12 h-12 bg-primary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[24px]">person</span>
            </div>
            <div>
              <p className="text-body-md text-on-surface font-medium">{user.email}</p>
              <p className="text-label-sm text-on-surface-variant">ID: {user.id}</p>
            </div>
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-label-sm text-on-surface-variant uppercase tracking-wider mb-1.5">Celular</label>
            <input
              type="text"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full bg-surface border border-outline-variant/30 px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
            />
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
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
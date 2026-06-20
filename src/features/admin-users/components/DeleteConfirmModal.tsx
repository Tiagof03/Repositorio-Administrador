import type { AdminUser } from '@/features/admin-users/types'
interface DeleteConfirmModalProps {
  user: AdminUser
  onConfirm: () => void
  onClose: () => void
  isDeleting: boolean
}
export default function DeleteConfirmModal({ user, onConfirm, onClose, isDeleting }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface-container border border-outline-variant/20 w-full max-w-sm mx-4 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 bg-error-container/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-error">warning</span>
          </div>
          <h3 className="text-headline-sm text-on-surface font-bold">Eliminar Usuario</h3>
          <p className="text-body-md text-on-surface-variant">
            ¿Estás seguro de eliminar a <strong className="text-on-surface">{user.nombre} {user.apellido}</strong>?
          </p>
          <p className="text-label-sm text-on-surface-variant/60">Esta acción es reversible (soft delete).</p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant text-label-md font-bold hover:bg-surface-container-high transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-error text-on-error text-label-md font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Eliminando...
              </>
            ) : (
              'Eliminar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
import type { Category } from '@/features/categorias/types'
interface Props {
  category: Category
  onConfirm: () => void
  onClose: () => void
  isDeleting: boolean
}
export default function DeleteConfirmModal({
  category,
  onConfirm,
  onClose,
  isDeleting,
}: Props) {
  const hasSubs = (category.hijos?.length ?? 0) > 0
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface-container border border-outline-variant/20 w-full max-w-sm mx-4 flex flex-col">
        <div className="px-6 py-5 border-b border-outline-variant/20">
          <h2 className="text-headline-md font-bold text-on-surface">
            Eliminar {category.parent_id !== null ? 'Subcategoría' : 'Categoría'}
          </h2>
        </div>
        <div className="px-6 py-6 flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-error-container/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-[24px]">
                delete_forever
              </span>
            </div>
            <div>
              <p className="text-body-md text-on-surface">
                ¿Estás seguro de que querés eliminar{' '}
                <span className="font-bold text-primary">"{category.nombre}"</span>?
              </p>
              {hasSubs && (
                <p className="text-label-sm font-label-sm text-error mt-2">
                  Esta categoría tiene {category.hijos!.length} subcategoría(s) que también se eliminarán.
                </p>
              )}
              <p className="text-label-sm font-label-sm text-on-surface-variant/60 mt-2">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-error-container text-on-error-container text-label-md font-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">
                  progress_activity
                </span>
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
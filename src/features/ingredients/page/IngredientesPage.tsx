import { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { useIngredients } from '@/features/ingredients/hooks/useIngredients'
import type { Ingredient, IngredientFormData } from '@/features/ingredients/types'
import IngredientsTable from '@/features/ingredients/components/IngredientsTable'
import IngredientFormModal from '@/features/ingredients/components/IngredientFormModal'

/* ── Delete Confirm Modal (inline) ── */
function DeleteConfirmModal({
  ingredient,
  onConfirm,
  onClose,
  isDeleting,
}: {
  ingredient: Ingredient
  onConfirm: () => void
  onClose: () => void
  isDeleting: boolean
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface-container border border-outline-variant/20 w-full max-w-sm mx-4 flex flex-col">
        <div className="px-6 py-5 border-b border-outline-variant/20">
          <h2 className="text-headline-md font-bold text-on-surface">Eliminar Ingrediente</h2>
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
                ¿Estás seguro de que querés eliminar el ingrediente{' '}
                <span className="font-bold text-primary">"{ingredient.nombre}"</span>?
              </p>
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

/* ── Página principal ── */
export default function IngredientesPage() {
  const rol = useAuthStore((s) => s.rol)
  const isAdmin = rol === 'admin'

  const {
    data: ingredients, isLoading, isError, error, refetch,
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isCreating, isUpdating, isDeleting
  } = useIngredients()

  const [showForm, setShowForm] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [deletingIngredient, setDeletingIngredient] = useState<Ingredient | null>(null)

  const handleCreate = () => {
    setEditingIngredient(null)
    setShowForm(true)
  }

  const handleEdit = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient)
    setShowForm(true)
  }

  const handleFormSubmit = (data: IngredientFormData) => {
    if (editingIngredient) {
      updateMutation.mutate(
        { id: editingIngredient.id, payload: data },
        { onSuccess: () => setShowForm(false) },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setShowForm(false),
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deletingIngredient) return
    deleteMutation.mutate(deletingIngredient.id, {
      onSuccess: () => setDeletingIngredient(null),
    })
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">
          progress_activity
        </span>
        <p className="text-body-md text-on-surface-variant">Cargando ingredientes...</p>
      </div>
    )
  }

  // Error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-16 h-16 bg-error-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-error">cloud_off</span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          Error al cargar los ingredientes
        </p>
        <p className="text-label-sm font-label-sm text-on-surface-variant/50">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </p>
        <button
          onClick={() => void refetch()}
          className="mt-2 px-6 py-2.5 border border-outline-variant/30 text-on-surface text-label-md font-label-md hover:bg-surface-container-high transition-colors cursor-pointer flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h2 className="text-headline-lg font-bold text-on-surface">Ingredientes</h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Gestión de ingredientes del menú y control de alérgenos.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleCreate}
            className="bg-primary-container text-on-primary-container px-8 py-3 text-label-md font-label-md font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Añadir Ingrediente
          </button>
        )}
      </div>

      {/* Table */}
      <IngredientsTable
        data={ingredients ?? []}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={setDeletingIngredient}
      />

      {/* Form Modal */}
      {showForm && (
        <IngredientFormModal
          ingredient={editingIngredient}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
          isSubmitting={isCreating || isUpdating}
        />
      )}

      {/* Delete Modal */}
      {deletingIngredient && (
        <DeleteConfirmModal
          ingredient={deletingIngredient}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingIngredient(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  )
}
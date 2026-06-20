import { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/categorias/hooks/useCategories'
import type { Category, CategoryFormData } from '@/features/categorias/types'
import CategoriesTable from '@/features/categorias/components/CategoriesTable'
import CategoryFormModal from '@/features/categorias/components/CategoryFormModal'
import DeleteConfirmModal from '@/features/categorias/components/DeleteConfirmModal'
import { SkeletonTable } from '@/shared/Skeleton'

export default function CategoriasPage() {
  const rol = useAuthStore((s) => s.rol)
  const isAdmin = rol === 'admin'

  const { data: categories, isLoading, isError, error, refetch } = useCategories()

  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [defaultParentId, setDefaultParentId] = useState<number | null>(null)

  const handleCreate = () => {
    setEditingCategory(null)
    setDefaultParentId(null)
    setShowForm(true)
  }

  const handleAddSub = (parentId: number) => {
    setEditingCategory(null)
    setDefaultParentId(parentId)
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setDefaultParentId(null)
    setShowForm(true)
  }

  const handleFormSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate(
        { id: editingCategory.id, payload: data },
        { onSuccess: () => setShowForm(false) },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setShowForm(false),
      })
    }
  }

  const handleDeleteConfirm = () => {
    if (!deletingCategory) return
    deleteMutation.mutate(deletingCategory.id, {
      onSuccess: () => setDeletingCategory(null),
    })
  }

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <div className="animate-pulse bg-surface-container-high h-8 w-48 mb-2" />
            <div className="animate-pulse bg-surface-container-high h-4 w-72" />
          </div>
          <div className="animate-pulse bg-surface-container-high h-10 w-36" />
        </div>
        <SkeletonTable rows={6} columns={4} />
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
          Error al cargar las categorías
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
          <h2 className="text-headline-lg font-bold text-on-surface">Categorías</h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Gestiona la estructura del menú principal y subcategorías.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={handleCreate}
            className="bg-primary-container text-on-primary-container px-8 py-3 text-label-md font-label-md font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nueva Categoría
          </button>
        )}
      </div>

      {/* Table */}
      <CategoriesTable
        data={categories ?? []}
        isAdmin={isAdmin}
        onEdit={handleEdit}
        onDelete={setDeletingCategory}
        onAddSub={handleAddSub}
      />

      {/* Form Modal */}
      {showForm && (
        <CategoryFormModal
          category={editingCategory}
          parentCategories={categories ?? []}
          defaultParentId={defaultParentId}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {/* Delete Modal */}
      {deletingCategory && (
        <DeleteConfirmModal
          category={deletingCategory}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingCategory(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  )
}

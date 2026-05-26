import { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useToggleDisponible,
} from '@/features/products/hooks/useProducts'
import { useCategories } from '@/features/categorias/hooks/useCategories'
import { useIngredients } from '@/features/ingredients/hooks/useIngredients'
import { useUnidadesMedida } from '@/features/unidades-medida/hooks/useUnidadesMedida'
import type { Product, ProductFormData } from '@/features/products/types'
import ProductsTable from '@/features/products/components/ProductsTable'
import ProductFormModal from '@/features/products/components/ProductFormModal'
import DeleteConfirmModal from '@/features/products/components/DeleteConfirmModal'
export default function ProductosPage() {
  const rol = useAuthStore((s) => s.rol)
  const isAdmin = rol === 'admin'
  const { data: products, isLoading, isError, error, refetch } = useProducts()
  const { data: categories } = useCategories()
  const { data: ingredients } = useIngredients()
  const { data: unidades } = useUnidadesMedida()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()
  const toggleMutation = useToggleDisponible()
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  /* ── Handlers ── */
  const handleCreate = () => {
    setEditingProduct(null)
    setShowForm(true)
  }
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }
  const handleFormSubmit = (data: ProductFormData) => {
    if (editingProduct) {
      updateMutation.mutate(
        { id: editingProduct.id, payload: data },
        { onSuccess: () => setShowForm(false) },
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => setShowForm(false),
      })
    }
  }
  const handleDeleteConfirm = () => {
    if (!deletingProduct) return
    deleteMutation.mutate(deletingProduct.id, {
      onSuccess: () => setDeletingProduct(null),
    })
  }
  const handleToggle = (product: Product) => {
    toggleMutation.mutate({ id: product.id, disponible: !product.disponible })
  }
  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <span className="material-symbols-outlined animate-spin text-[48px] text-primary">
          progress_activity
        </span>
        <p className="text-body-md text-on-surface-variant">Cargando productos...</p>
      </div>
    )
  }
  /* ── Error ── */
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="w-16 h-16 bg-error-container/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-[32px] text-error">cloud_off</span>
        </div>
        <p className="text-body-md text-on-surface-variant">
          Error al cargar los productos
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
  /* ── Estadísticas rápidas ── */
  const total = products?.length ?? 0
  const disponibles = products?.filter((p) => p.disponible).length ?? 0
  const noDisponibles = total - disponibles
  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div className="space-y-1">
          <h2 className="text-headline-lg font-bold text-on-surface">Productos</h2>
          <p className="text-body-md text-on-surface-variant max-w-2xl">
            Gestión del menú: productos, precios, disponibilidad e ingredientes.
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={handleCreate}
            className="bg-primary-container text-on-primary-container px-8 py-3 text-label-md font-label-md font-bold uppercase tracking-wider flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nuevo Producto
          </button>
        )}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container border border-outline-variant/20 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-container/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[22px]">
              restaurant_menu
            </span>
          </div>
          <div>
            <p className="text-headline-md font-bold text-on-surface">{total}</p>
            <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-wider">
              Total
            </p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant/20 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-tertiary-container/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-tertiary text-[22px]">
              check_circle
            </span>
          </div>
          <div>
            <p className="text-headline-md font-bold text-on-surface">{disponibles}</p>
            <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-wider">
              Disponibles
            </p>
          </div>
        </div>
        <div className="bg-surface-container border border-outline-variant/20 p-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-error-container/15 flex items-center justify-center">
            <span className="material-symbols-outlined text-error text-[22px]">
              cancel
            </span>
          </div>
          <div>
            <p className="text-headline-md font-bold text-on-surface">{noDisponibles}</p>
            <p className="text-label-sm text-on-surface-variant/60 uppercase tracking-wider">
              No disponibles
            </p>
          </div>
        </div>
      </div>
      {/* Table */}
      <ProductsTable
        data={products ?? []}
        isAdmin={isAdmin}
        unidades={unidades ?? []}
        onEdit={handleEdit}
        onDelete={setDeletingProduct}
        onToggle={handleToggle}
      />
      {/* Form Modal */}
      {showForm && (
        <ProductFormModal
          product={editingProduct}
          categories={categories ?? []}
          ingredients={ingredients ?? []}
          unidades={unidades ?? []}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}
      {/* Delete Modal */}
      {deletingProduct && (
        <DeleteConfirmModal
          product={deletingProduct}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingProduct(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </>
  )
}

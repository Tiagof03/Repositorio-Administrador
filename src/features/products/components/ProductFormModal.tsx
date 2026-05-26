import { useState, useEffect, useMemo } from 'react'
import type { Product, ProductFormData } from '@/features/products/types'
import type { Category } from '@/features/categorias/types'
import type { Ingredient } from '@/features/ingredients/types'
import type { UnidadMedida } from '@/features/unidades-medida/types'
interface Props {
  product: Product | null
  categories: Category[]
  ingredients: Ingredient[]
  unidades: UnidadMedida[]
  onSubmit: (data: ProductFormData) => void
  onClose: () => void
  isSubmitting: boolean
}
const TIPO_LABELS: Record<string, string> = {
  masa: 'Masa',
  volumen: 'Volumen',
  unidad: 'Unidad',
  area: 'Área',
}
export default function ProductFormModal({
  product,
  categories,
  ingredients,
  unidades,
  onSubmit,
  onClose,
  isSubmitting,
}: Props) {
  const isEditing = !!product
  const [nombre, setNombre] = useState(product?.nombre ?? '')
  const [descripcion, setDescripcion] = useState(product?.descripcion ?? '')
  const [precioBase, setPrecioBase] = useState<number>(product?.precioBase ?? 0)
  const [stockCantidad, setStockCantidad] = useState<number>(product?.stockCantidad ?? 0)
  const [imageUrl, setImageUrl] = useState(product?.imagenesUrl?.[0] ?? '')
  const [disponible, setDisponible] = useState(product?.disponible ?? true)
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([])
  const [selectedIngIds, setSelectedIngIds] = useState<number[]>([])
  const [unidadVentaId, setUnidadVentaId] = useState<number | null>(
    product?.unidadVentaId ?? null,
  )
  const unidadesByTipo = useMemo(() => {
    const map: Record<string, UnidadMedida[]> = {}
    for (const u of unidades) {
      if (!map[u.tipo]) map[u.tipo] = []
      map[u.tipo].push(u)
    }
    return map
  }, [unidades])
  useEffect(() => {
    if (product) {
      setNombre(product.nombre)
      setDescripcion(product.descripcion ?? '')
      setPrecioBase(product.precioBase)
      setStockCantidad(product.stockCantidad)
      setImageUrl(product.imagenesUrl?.[0] ?? '')
      setDisponible(product.disponible)
      setUnidadVentaId(product.unidadVentaId)
    }
  }, [product])
  const toggleCat = (id: number) => {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }
  const toggleIng = (id: number) => {
    setSelectedIngIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre.trim() || precioBase <= 0) return
    onSubmit({
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || undefined,
      precioBase,
      imagenesUrl: imageUrl.trim() ? [imageUrl.trim()] : [],
      stockCantidad,
      disponible,
      unidadVentaId,
      categorias: selectedCatIds.map((id, i) => ({
        categoriaId: id,
        esPrincipal: i === 0,
      })),
      ingredientes: selectedIngIds.map((id) => ({
        ingredienteId: id,
        cantidad: 1,
        unidadMedidaId: 1,
        esRemovible: false,
      })),
    })
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto py-8">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      {/* Modal */}
      <div className="relative bg-surface-container border border-outline-variant/20 w-full max-w-3xl mx-4 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">
              {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            {isEditing && (
              <p className="text-label-sm text-on-surface-variant/60 mt-0.5">
                Editando: <span className="text-primary">{product.nombre}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {/* Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-12 gap-gutter p-6">
            {/* ── Columna izquierda: datos principales ── */}
            <div className="col-span-12 md:col-span-8 flex flex-col gap-6">
              {/* Información general */}
              <section className="bg-surface-container-low p-6 border border-outline-variant/20 flex flex-col gap-6">
                <h3 className="text-label-md font-label-md text-primary uppercase tracking-widest">
                  Información General
                </h3>
                {/* Nombre */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Midnight Ramen"
                    className="bg-background border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 transition-colors placeholder:text-on-surface-variant/40"
                  />
                </div>
                {/* Descripción */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">
                    Descripción
                  </label>
                  <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción completa del producto..."
                    rows={3}
                    className="bg-background border border-outline-variant focus:border-primary focus:ring-0 text-body-md p-3 transition-colors resize-none placeholder:text-on-surface-variant/40"
                  />
                </div>
                {/* Categorías */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">
                    Categorías
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => {
                      const selected = selectedCatIds.includes(cat.id)
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleCat(cat.id)}
                          className={`px-4 py-2 text-label-sm font-label-sm border transition-all cursor-pointer flex items-center gap-2 ${
                            selected
                              ? 'bg-primary-container/20 border-primary text-primary'
                              : 'bg-surface-container-high border-outline-variant/30 text-on-surface-variant hover:border-outline hover:text-on-surface'
                          }`}
                        >
                          {cat.nombre}
                          {selected && (
                            <span className="material-symbols-outlined text-[16px]">check</span>
                          )}
                        </button>
                      )
                    })}
                    {categories.length === 0 && (
                      <p className="text-label-sm text-on-surface-variant/50">
                        No hay categorías disponibles
                      </p>
                    )}
                  </div>
                </div>
              </section>
              {/* Precio, Stock y Unidad */}
              <section className="bg-surface-container-low p-6 border border-outline-variant/20 flex flex-col gap-6">
                <h3 className="text-label-md font-label-md text-primary uppercase tracking-widest">
                  Precio, Stock y Unidad
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Precio */}
                  <div className="flex flex-col gap-2">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Precio ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-md">
                        $
                      </span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={precioBase || ''}
                        onChange={(e) => setPrecioBase(parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="w-full bg-background border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 pl-4 transition-colors placeholder:text-on-surface-variant/40"
                      />
                    </div>
                  </div>
                  {/* Stock */}
                  <div className="flex flex-col gap-2">
                    <label className="text-label-sm font-label-sm text-on-surface-variant">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockCantidad}
                      onChange={(e) => setStockCantidad(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-background border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 transition-colors placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>
                {/* Unidad de venta */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">
                    Unidad de Venta
                  </label>
                  <select
                    value={unidadVentaId ?? ''}
                    onChange={(e) => setUnidadVentaId(e.target.value ? Number(e.target.value) : null)}
                    className="bg-background border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 transition-colors cursor-pointer"
                  >
                    <option value="">Sin unidad</option>
                    {Object.entries(unidadesByTipo).map(([tipo, lista]) => (
                      <optgroup key={tipo} label={TIPO_LABELS[tipo] ?? tipo}>
                        {lista.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.nombre} ({u.simbolo})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </section>
              {/* Ingredientes */}
              <section className="bg-surface-container-low p-6 border border-outline-variant/20 flex flex-col gap-4">
                <h3 className="text-label-md font-label-md text-primary uppercase tracking-widest">
                  Ingredientes
                </h3>
                <p className="text-label-sm text-on-surface-variant/60">
                  Seleccioná los ingredientes que componen este producto.
                </p>
                <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-2">
                  {ingredients.map((ing) => {
                    const selected = selectedIngIds.includes(ing.id)
                    return (
                      <button
                        key={ing.id}
                        type="button"
                        onClick={() => toggleIng(ing.id)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-left border transition-all cursor-pointer ${
                          selected
                            ? 'bg-primary-container/10 border-primary/40 text-on-surface'
                            : 'bg-surface-container-high/50 border-outline-variant/20 text-on-surface-variant hover:border-outline'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 flex items-center justify-center border ${
                            selected
                              ? 'bg-primary-container border-primary'
                              : 'border-outline-variant/40'
                          }`}
                        >
                          {selected && (
                            <span className="material-symbols-outlined text-on-primary-container text-[14px]">
                              check
                            </span>
                          )}
                        </span>
                        <span className="text-label-sm font-label-sm flex-1 truncate">
                          {ing.nombre}
                        </span>
                        {ing.es_alergeno && (
                          <span
                            className="material-symbols-outlined text-error text-[16px]"
                            title="Alérgeno"
                          >
                            warning
                          </span>
                        )}
                      </button>
                    )
                  })}
                  {ingredients.length === 0 && (
                    <p className="col-span-2 text-label-sm text-on-surface-variant/50 py-4 text-center">
                      No hay ingredientes disponibles
                    </p>
                  )}
                </div>
                {selectedIngIds.length > 0 && (
                  <p className="text-label-sm text-on-surface-variant/60">
                    {selectedIngIds.length} ingrediente(s) seleccionado(s)
                  </p>
                )}
              </section>
            </div>
            {/* ── Columna derecha: imagen y estado ── */}
            <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
              {/* Imagen */}
              <section className="bg-surface-container-low p-6 border border-outline-variant/20 flex flex-col gap-4">
                <h3 className="text-label-md font-label-md text-primary uppercase tracking-widest">
                  Imagen del Producto
                </h3>
                <div className="aspect-square bg-surface-variant/40 border border-outline-variant/20 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">
                        add_photo_alternate
                      </span>
                      <p className="text-label-sm text-on-surface-variant/40">Sin imagen</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">
                    URL de la imagen
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-background border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 transition-colors placeholder:text-on-surface-variant/40 text-sm"
                  />
                </div>
              </section>
              {/* Estado */}
              <section className="bg-surface-container-low p-6 border border-outline-variant/20 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-label-md font-label-md text-on-surface uppercase tracking-widest">
                      Disponibilidad
                    </h3>
                    <p className="text-label-sm text-on-surface-variant/60 mt-0.5">
                      Visible en el menú público
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={disponible}
                      onChange={(e) => setDisponible(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-surface-container-highest peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container" />
                  </label>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      disponible
                        ? 'bg-tertiary animate-pulse shadow-[0_0_8px_rgba(96,218,196,0.6)]'
                        : 'bg-on-surface-variant/40'
                    }`}
                  />
                  <span className="text-label-sm font-label-sm text-on-surface uppercase">
                    {disponible ? 'Activo en menú' : 'Oculto del menú'}
                  </span>
                </div>
              </section>
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-outline-variant/20 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 border border-outline-variant/30 text-on-surface-variant text-label-md font-label-md hover:bg-surface-container-high transition-colors cursor-pointer disabled:opacity-50 uppercase tracking-wider"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nombre.trim() || precioBase <= 0}
              className="px-8 py-2.5 bg-primary-container text-on-primary-container text-label-md font-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Crear Producto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
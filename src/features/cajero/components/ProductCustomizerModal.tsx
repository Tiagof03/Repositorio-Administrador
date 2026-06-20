import { useState, useEffect } from 'react'
import { getProductIngredients } from '@/features/cajero/services/cajero.service'
import type { CajeroProduct, IngredientePersonalizado } from '@/features/cajero/types'

interface ProductCustomizerModalProps {
  product: CajeroProduct
  onConfirm: (personalizacion: number[] | null) => void
  onClose: () => void
}

export default function ProductCustomizerModal({
  product,
  onConfirm,
  onClose,
}: ProductCustomizerModalProps) {
  const [ingredients, setIngredients] = useState<IngredientePersonalizado[]>([])
  const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getProductIngredients(product.id).then((data) => {
      if (!cancelled) {
        setIngredients(data)
        setLoading(false)
      }
    }).catch(() => {
      if (!cancelled) {
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [product.id])

  const toggleIngredient = (id: number) => {
    setExcludedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConfirm = () => {
    onConfirm(excludedIds.size > 0 ? Array.from(excludedIds) : null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface-container border border-outline-variant/20 w-full max-w-md mx-4 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-headline-md text-on-surface font-bold">{product.nombre}</h3>
            <p className="text-label-sm text-on-surface-variant mt-0.5">
              Personalizá los ingredientes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <span className="material-symbols-outlined animate-spin text-on-surface-variant">progress_activity</span>
            </div>
          ) : ingredients.length === 0 ? (
            <p className="text-body-md text-on-surface-variant text-center py-8">
              Este producto no tiene ingredientes para personalizar
            </p>
          ) : (
            <div className="space-y-1">
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-3">
                Ingredientes
              </p>
              {ingredients.map((ing) => {
                const isExcluded = excludedIds.has(ing.id)
                return (
                  <label
                    key={ing.id}
                    className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-all ${
                      isExcluded
                        ? 'border-error/30 bg-error/5'
                        : 'border-outline-variant/10 bg-surface-container-high/50 hover:bg-surface-container-high'
                    } ${!ing.es_removible ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={!isExcluded}
                      disabled={!ing.es_removible}
                      onChange={() => toggleIngredient(ing.id)}
                      className="accent-primary w-4 h-4"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-body-md text-on-surface truncate">{ing.nombre}</p>
                      {ing.es_alergeno && (
                        <span className="text-label-xs text-error">Alérgeno</span>
                      )}
                    </div>
                    {!ing.es_removible && (
                      <span className="text-label-xs text-on-surface-variant">Fijo</span>
                    )}
                  </label>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 flex gap-3 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-outline-variant text-on-surface-variant text-label-md font-bold hover:bg-surface-container-high transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-primary-container text-on-primary-container text-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

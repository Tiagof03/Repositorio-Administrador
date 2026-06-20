import { useState } from 'react'
import type { Product } from '@/features/products/types'

interface Props {
  product: Product
  onSubmit: (stockCantidad: number) => void
  onClose: () => void
  isSubmitting: boolean
}

export default function StockEditModal({ product, onSubmit, onClose, isSubmitting }: Props) {
  const [stockCantidad, setStockCantidad] = useState(product.stockCantidad)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(stockCantidad)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface-container border border-outline-variant/20 w-full max-w-sm mx-4 flex flex-col">
        <div className="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">Editar Stock</h2>
            <p className="text-label-sm text-on-surface-variant/60 mt-0.5">{product.nombre}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-label-sm font-label-sm text-on-surface-variant">Stock</label>
            <input
              type="number"
              min="0"
              value={stockCantidad}
              onChange={(e) => setStockCantidad(parseInt(e.target.value) || 0)}
              className="bg-background border-b border-outline-variant focus:border-primary focus:ring-0 text-body-md py-2 transition-colors"
              autoFocus
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-outline-variant/10">
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
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-primary-container text-on-primary-container text-label-md font-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Guardando...
                </>
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

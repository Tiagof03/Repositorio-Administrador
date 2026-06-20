import { useState, useMemo } from 'react'
import type { CajeroProduct } from '@/features/cajero/types'
import ProductCard from '@/features/cajero/components/ProductCard'
interface ProductGridProps {
  products: CajeroProduct[]
  onAddProduct: (product: CajeroProduct) => void
}
export default function ProductGrid({ products, onAddProduct }: ProductGridProps) {
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    if (!search.trim()) return products
    const q = search.toLowerCase()
    return products.filter((p) => p.nombre.toLowerCase().includes(q))
  }, [products, search])
  return (
    <div className="flex flex-col gap-4 flex-1 min-w-0">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">search</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto por nombre..."
          className="w-full bg-surface-container border border-outline-variant/20 pl-10 pr-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto flex-1 content-start pb-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={onAddProduct} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 gap-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">search_off</span>
            <p className="text-body-md text-on-surface-variant/60">
              {search ? `Sin resultados para "${search}"` : 'No hay productos disponibles'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
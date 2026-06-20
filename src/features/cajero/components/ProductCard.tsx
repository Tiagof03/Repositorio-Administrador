import type { CajeroProduct } from '@/features/cajero/types'
interface ProductCardProps {
  product: CajeroProduct
  onAdd: (product: CajeroProduct) => void
}
export default function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <button
      onClick={() => onAdd(product)}
      className="group bg-surface-container border border-outline-variant/20 p-4 flex flex-col gap-3 hover:border-primary/50 hover:bg-surface-container-high transition-all active:scale-[0.97] text-left cursor-pointer"
    >
      <div className="w-full aspect-video bg-surface-container-high flex items-center justify-center overflow-hidden rounded">
        {product.imagenesUrl && product.imagenesUrl[0] ? (
          <img src={product.imagenesUrl[0]} alt={product.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/30">restaurant_menu</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <h4 className="text-body-md text-on-surface font-medium line-clamp-2">{product.nombre}</h4>
        {product.descripcion && (
          <p className="text-label-sm text-on-surface-variant/60 line-clamp-1">{product.descripcion}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-label-lg font-bold text-primary">${product.precioBase.toFixed(2)}</span>
        <span className="material-symbols-outlined text-[20px] text-primary/70 group-hover:text-primary transition-colors">add_circle</span>
      </div>
    </button>
  )
}
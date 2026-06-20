import type { CartItem, FormaPago } from '@/features/cajero/types'
interface CartPanelProps {
  items: CartItem[]
  formasPago: FormaPago[]
  selectedPago: string
  onSelectPago: (codigo: string) => void
  clienteNombre: string
  onClienteNombreChange: (nombre: string) => void
  onUpdateQuantity: (productId: number, cantidad: number) => void
  onRemoveItem: (productId: number) => void
  subtotal: number
  isEmpty: boolean
  isSubmitting: boolean
  onCreateOrder: () => void
}
export default function CartPanel({
  items, formasPago, selectedPago, onSelectPago, clienteNombre, onClienteNombreChange,
  onUpdateQuantity, onRemoveItem, subtotal, isEmpty, isSubmitting, onCreateOrder,
}: CartPanelProps) {
  return (
    <div className="w-96 bg-surface-container border-l border-outline-variant/20 flex flex-col shrink-0">
      <div className="px-5 py-4 border-b border-outline-variant/20">
        <h3 className="text-headline-sm text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
          Carrito
        </h3>
        <p className="text-label-sm text-on-surface-variant">{items.length} productos</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/20">add_shopping_cart</span>
            <p className="text-body-md text-on-surface-variant/60 text-center">Seleccioná productos para comenzar</p>
          </div>
        ) : (
          items.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="bg-surface-container-high border border-outline-variant/10 p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-body-md text-on-surface font-medium truncate">{item.nombre}</p>
                <p className="text-label-sm text-on-surface-variant">${item.precioBase.toFixed(2)} c/u</p>
                {item.personalizacion && item.personalizacion.length > 0 && (
                  <p className="text-label-xs text-tertiary mt-0.5 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">tune</span>
                    {item.personalizacion.length} modificación{item.personalizacion.length > 1 ? 'es' : ''}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">remove</span>
                </button>
                <span className="w-8 text-center text-body-md text-on-surface font-bold">{item.cantidad}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-surface-container border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>
              <span className="text-body-md text-on-surface font-bold w-20 text-right">
                ${(item.precioBase * item.cantidad).toFixed(2)}
              </span>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-on-surface-variant/40 hover:text-error transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="px-5 py-4 border-t border-outline-variant/20 space-y-3">
        <div className="flex justify-between text-headline-md text-on-surface font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div>
          <label className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1 block">
            Nombre / Para quién es
          </label>
          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => onClienteNombreChange(e.target.value)}
            placeholder="Ej: Juan Pérez, Mesa 5"
            className="w-full bg-surface border border-outline-variant/30 px-3 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={selectedPago}
          onChange={(e) => onSelectPago(e.target.value)}
          className="w-full bg-surface border border-outline-variant/30 px-3 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary/50"
        >
          <option value="">Seleccionar forma de pago</option>
          {formasPago.map((fp) => (
            <option key={fp.codigo} value={fp.codigo}>{fp.descripcion}</option>
          ))}
        </select>
        <button
          onClick={onCreateOrder}
          disabled={isEmpty || !selectedPago || !clienteNombre.trim() || isSubmitting}
          className="w-full bg-primary-container text-on-primary-container py-3 text-label-md font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
              Creando pedido...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">receipt</span>
              Crear Pedido
            </>
          )}
        </button>
      </div>
    </div>
  )
}
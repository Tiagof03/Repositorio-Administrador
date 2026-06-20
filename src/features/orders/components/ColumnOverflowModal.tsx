import { useEffect, useRef } from 'react'
import type { Order } from '@/features/orders/types'

interface Props {
  title: string
  orders: Order[]
  showLimit: number
  onClose: () => void
  onSelectOrder: (order: Order) => void
  selectedOrderId: number | null
}

function itemsSummary(items: Order['items']): string {
  return items.map((i) => `${i.nombreSnapshot} x${i.cantidad}`).join(', ')
}

export default function ColumnOverflowModal({
  title,
  orders,
  showLimit,
  onClose,
  onSelectOrder,
  selectedOrderId,
}: Props) {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [orders])

  const overflowOrders = orders.slice(showLimit)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-surface-container border border-outline-variant/20 w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/20">
          <div>
            <h2 className="text-headline-md font-bold text-on-surface">{title}</h2>
            <p className="text-label-sm text-on-surface-variant/60 mt-0.5">
              {overflowOrders.length} pedido{overflowOrders.length !== 1 ? 's' : ''} más de {orders.length} totales
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <div ref={listRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {overflowOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onSelectOrder(order)}
              className={`bg-surface-container-high p-4 border transition-all cursor-pointer ${
                selectedOrderId === order.id
                  ? 'border-l-2 border-l-on-surface-variant/40 border-outline-variant/30'
                  : 'border border-outline-variant/20 hover:border-primary/40'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-sm text-on-surface-variant font-bold">
                  #ORD-{String(order.id).padStart(4, '0')}
                </span>
                <span className="text-on-surface-variant text-[10px] uppercase font-medium">
                  {new Date(order.creadoEn).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <h4 className="text-body-md text-on-surface font-medium mb-1">
                {order.clienteNombre}
              </h4>
              <p className="text-on-surface-variant text-sm italic line-clamp-2 mb-3">
                {itemsSummary(order.items)}
              </p>
              <div className="flex justify-between items-center pt-3 border-t border-outline-variant/10">
                <span className="text-on-surface font-bold">
                  ${order.total.toFixed(2)}
                </span>
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant/60">
                  chevron_right
                </span>
              </div>
            </div>
          ))}
          {overflowOrders.length === 0 && (
            <p className="text-label-sm text-on-surface-variant/50 text-center py-8">
              No hay más pedidos para mostrar
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

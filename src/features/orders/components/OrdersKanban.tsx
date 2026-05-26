import { useMemo } from 'react'
import type { Order } from '@/features/orders/types'
const KANBAN_COLUMNS = [
  {
    key: 'PENDIENTE',
    label: 'Pendientes',
    include: ['PENDIENTE', 'CONFIRMADO'],
    dotColor: 'bg-primary-container',
    borderColor: 'border-l-primary',
    textColor: 'text-primary',
  },
  {
    key: 'EN_PREP',
    label: 'En Preparación',
    include: ['EN_PREP'],
    dotColor: 'bg-tertiary',
    borderColor: 'border-l-tertiary',
    textColor: 'text-tertiary',
  },
  {
    key: 'EN_CAMINO',
    label: 'Listo para Entrega',
    include: ['EN_CAMINO'],
    dotColor: 'bg-secondary',
    borderColor: 'border-l-secondary',
    textColor: 'text-secondary',
  },
  {
    key: 'ENTREGADO',
    label: 'Entregados',
    include: ['ENTREGADO'],
    dotColor: 'bg-on-surface-variant/40',
    borderColor: 'border-l-on-surface-variant/40',
    textColor: 'text-on-surface-variant',
    muted: true,
  },
]
function itemsSummary(items: Order['items']): string {
  return items.map((i) => `${i.nombreSnapshot} x${i.cantidad}`).join(', ')
}
interface OrdersKanbanProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  selectedOrderId: number | null
}
export default function OrdersKanban({
  orders,
  onSelectOrder,
  selectedOrderId,
}: OrdersKanbanProps) {
  const grouped = useMemo(() => {
    const map: Record<string, Order[]> = {}
    for (const col of KANBAN_COLUMNS) {
      map[col.key] = orders.filter((o) => col.include.includes(o.estadoCodigo))
    }
    return map
  }, [orders])
  return (
    <div className="flex gap-6 flex-1 min-h-[700px] overflow-x-auto pb-4">
      {KANBAN_COLUMNS.map((col) => {
        const colOrders = grouped[col.key]
        return (
          <div
            key={col.key}
            className={`flex flex-col bg-surface-container-low/50 p-3 w-80 shrink-0 rounded-xl ${
              col.muted ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
                <h3 className="text-label-md text-on-surface uppercase tracking-wider font-bold">
                  {col.label}
                </h3>
              </div>
              <span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 text-[10px] font-bold">
                {colOrders.length}
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1 flex-1">
              {colOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => onSelectOrder(order)}
                  className={`bg-surface-container-lowest p-4 border border-surface-container rounded-xl hover:shadow-[0px_4px_20px_rgba(0,0,0,0.04)] transition-all cursor-pointer ${
                    selectedOrderId === order.id
                      ? `${col.borderColor} border-l-2`
                      : 'border-l'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-label-sm ${col.textColor} font-bold`}>
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
                  <div className="flex justify-between items-center pt-3 border-t border-surface-container">
                    <span className="text-on-surface font-bold">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="material-symbols-outlined text-[20px] text-on-surface-variant/60">
                      chevron_right
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
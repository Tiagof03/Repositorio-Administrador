import { useState, useMemo } from 'react'
import { useOrders, useUpdateOrderStatus } from '@/features/orders/hooks/useOrders'
import { useClientNames } from '@/features/orders/hooks/useClientNames'
import { hydrateClientNames } from '@/features/orders/services/admin.service'
import OrdersKanban from '@/features/orders/components/OrdersKanban'
import OrderDetailPanel from '@/features/orders/components/OrderDetailPanel'
import type { Order } from '@/features/orders/types'
export default function PedidosPage() {
  const { data: orders, isLoading, error } = useOrders()
  const { mutate: updateStatus } = useUpdateOrderStatus()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const namesMap = useClientNames(orders)
  const hydratedOrders = useMemo(
    () => (orders ? hydrateClientNames(orders, namesMap) : []),
    [orders, namesMap],
  )
  const handleStatusChange = (
    orderId: number,
    estadoHacia: string,
    motivo?: string | null,
  ) => {
    updateStatus({ id: orderId, estadoHacia, motivo })
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-on-surface-variant">Cargando pedidos...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="material-symbols-outlined text-[48px] text-error opacity-60">
          error_outline
        </span>
        <p className="text-body-md text-on-surface-variant">
          Error al cargar pedidos
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-on-primary text-label-md font-bold hover:brightness-110 transition-all"
        >
          Reintentar
        </button>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-headline-lg text-on-surface font-bold">
            Panel de Pedidos
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Gestión de pedidos en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-label-sm text-on-surface-variant bg-surface-container-high px-3 py-1.5 border border-outline-variant/20">
            {hydratedOrders.length} pedidos
          </span>
        </div>
      </div>
      <OrdersKanban
        orders={hydratedOrders}
        onSelectOrder={setSelectedOrder}
        selectedOrderId={selectedOrder?.id ?? null}
      />
      {selectedOrder && (
        <OrderDetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}
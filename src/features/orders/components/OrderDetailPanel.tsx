import type { Order, OrderStatus } from '@/features/orders/types'
import { FORMA_PAGO_LABELS } from '@/features/orders/types'
import StatusBadge from '@/features/orders/components/StatusBadge'
import StatusControl from '@/features/orders/components/StatusControl'
import { useAdminDireccion } from '@/features/orders/hooks/useOrders'
interface OrderDetailPanelProps {
  order: Order
  onClose: () => void
  onStatusChange?: (orderId: number, newStatus: OrderStatus) => void
}
export default function OrderDetailPanel({
  order,
  onClose,
  onStatusChange,
}: OrderDetailPanelProps) {
  const { data: direccion } = useAdminDireccion(order.direccionId)
  const createdDate = new Date(order.creadoEn)
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-surface-container border-l border-outline-variant/20 h-full overflow-y-auto flex flex-col animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container z-10 px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div>
            <h3 className="text-headline-md text-on-surface font-bold">
              #ORD-{String(order.id).padStart(4, '0')}
            </h3>
            <p className="text-label-sm text-on-surface-variant mt-0.5">
              {createdDate.toLocaleDateString('es-AR', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}{' '}
              a las{' '}
              {createdDate.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 px-6 py-5 flex flex-col gap-6">
          {/* Info general */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Cliente</p>
              <p className="text-body-md text-on-surface font-medium">{order.clienteNombre}</p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Estado</p>
              <StatusBadge status={order.estadoCodigo} />
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Forma de Pago</p>
              <p className="text-body-md text-on-surface">{FORMA_PAGO_LABELS[order.formaPagoCodigo] ?? order.formaPagoCodigo}</p>
            </div>
            {order.nombrePara && order.nombrePara !== "string" && (
              <div>
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Para</p>
                <p className="text-body-md text-on-surface">{order.nombrePara}</p>
              </div>
            )}
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">ID Usuario</p>
              <p className="text-body-md text-on-surface">Usuario #{order.usuarioId}</p>
            </div>
          </div>
          {/* Items */}
          <div>
            <h4 className="text-label-md text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-primary">receipt_long</span>
              Detalle del Pedido
            </h4>
            <div className="border border-outline-variant/20 divide-y divide-outline-variant/10">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-body-md text-on-surface truncate">{item.nombreSnapshot}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      x{item.cantidad} · ${item.precioSnapshot.toFixed(2)} c/u
                    </p>
                    {item.personalizacionNombres && item.personalizacionNombres.length > 0 && (
                      <p className="text-label-xs text-tertiary mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">tune</span>
                        Sin: {item.personalizacionNombres.join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="text-on-surface font-bold ml-4">
                    ${(item.cantidad * item.precioSnapshot).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Totales */}
          <div className="border border-outline-variant/20 px-4 py-3 space-y-2">
            <div className="flex justify-between text-body-md text-on-surface-variant">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.descuento > 0 && (
              <div className="flex justify-between text-body-md text-tertiary">
                <span>Descuento</span>
                <span>-${order.descuento.toFixed(2)}</span>
              </div>
            )}
            {order.costoEnvio > 0 && (
              <div className="flex justify-between text-body-md text-on-surface-variant">
                <span>Envío</span>
                <span>${order.costoEnvio.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-headline-md text-on-surface pt-2 border-t border-outline-variant/10">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
          {/* Dirección */}
          {direccion && (
            <div>
              <h4 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                Dirección de Entrega
              </h4>
              <div className="text-body-md text-on-surface bg-surface-container-high/50 px-4 py-3 border border-outline-variant/10 space-y-1">
                <p className="font-medium">{direccion.linea1}</p>
                {direccion.linea2 && <p className="text-on-surface-variant">{direccion.linea2}</p>}
                <p className="text-on-surface-variant text-label-md">
                  {direccion.ciudad}, {direccion.provincia} - CP {direccion.codigoPostal}
                </p>
                {direccion.alias && (
                  <p className="text-label-sm text-primary mt-1 italic">
                    &quot;{direccion.alias}&quot;
                  </p>
                )}
              </div>
            </div>
          )}
          {/* Notas */}
          {order.notas && (
            <div>
              <h4 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">sticky_note_2</span>
                Notas
              </h4>
              <p className="text-body-md text-on-surface bg-surface-container-high/50 px-4 py-3 border border-outline-variant/10">
                {order.notas}
              </p>
            </div>
          )}
        </div>
        {/* Footer: Status Control */}
        <div className="sticky bottom-0 bg-surface-container border-t border-outline-variant/20 px-6 py-4">
          <StatusControl
            orderId={order.id}
            currentStatus={order.estadoCodigo}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>
    </div>
  )
}
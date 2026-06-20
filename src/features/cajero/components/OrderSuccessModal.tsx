import type { PedidoOut } from '@/features/cajero/types'
interface OrderSuccessModalProps {
  pedido: PedidoOut
  onClose: () => void
}
export default function OrderSuccessModal({ pedido, onClose }: OrderSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface-container border border-outline-variant/20 w-full max-w-md mx-4 p-8 flex flex-col items-center gap-6 text-center">
        <div className="w-20 h-20 bg-tertiary-container/20 flex items-center justify-center rounded-full">
          <span className="material-symbols-outlined text-[48px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h3 className="text-headline-md text-on-surface font-bold">Pedido Creado</h3>
        <div className="bg-surface-container-high w-full px-6 py-4 border border-outline-variant/10 space-y-2">
          <div className="flex justify-between text-body-md">
            <span className="text-on-surface-variant">Pedido #</span>
            <span className="text-on-surface font-bold">ORD-{String(pedido.id).padStart(4, '0')}</span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-on-surface-variant">Total</span>
            <span className="text-on-surface font-bold">${pedido.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-body-md">
            <span className="text-on-surface-variant">Estado</span>
            <span className="text-on-surface font-bold uppercase">{pedido.estado_codigo}</span>
          </div>
          {pedido.nombre_para && (
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">Para</span>
              <span className="text-on-surface font-bold">{pedido.nombre_para}</span>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-full bg-primary-container text-on-primary-container py-3 text-label-md font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          Nuevo Pedido
        </button>
      </div>
    </div>
  )
}
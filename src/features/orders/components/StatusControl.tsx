import { useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { STATUS_LABELS, STATUS_ICONS } from '@/features/orders/types'
import type { OrderStatus } from '@/features/orders/types'
const TRANSITIONS: Record<OrderStatus, { next?: OrderStatus; canCancel: boolean }> = {
  PENDIENTE:  { next: 'CONFIRMADO',                canCancel: true },
  CONFIRMADO: { next: 'EN_PREP',                   canCancel: true },
  EN_PREP:    { next: 'ENTREGADO',                 canCancel: true },
  ENTREGADO:  {                                      canCancel: false },
  CANCELADO:  {                                      canCancel: false },
}
interface StatusControlProps {
  orderId: number
  currentStatus: OrderStatus
  onStatusChange?: (orderId: number, newStatus: string, motivo?: string | null) => void
}
export default function StatusControl({
  orderId,
  currentStatus,
  onStatusChange,
}: StatusControlProps) {
  const rol = useAuthStore((s) => s.rol)
  const canChange = rol === 'admin' || rol === 'cajero' || rol === 'empleado'
  const [showMotivo, setShowMotivo] = useState(false)
  const [motivo, setMotivo] = useState('')
  if (!canChange) return null
  const transition = TRANSITIONS[currentStatus]
  if (!transition) return null
  const isTerminal = currentStatus === 'ENTREGADO' || currentStatus === 'CANCELADO'
  if (isTerminal) return null
  const handleForward = () => {
    if (onStatusChange && transition.next) {
      onStatusChange(orderId, transition.next)
    }
  }
  const handleCancel = () => {
    if (!motivo.trim()) return
    if (onStatusChange) {
      onStatusChange(orderId, 'CANCELADO', motivo.trim())
    }
    setMotivo('')
    setShowMotivo(false)
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 flex-wrap">
        {transition.next && (
          <button
            onClick={handleForward}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary-container text-on-primary-container text-label-md font-bold hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {STATUS_ICONS[transition.next]}
            </span>
            Mover a {STATUS_LABELS[transition.next]}
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        )}
        {transition.canCancel && !showMotivo && (
          <button
            onClick={() => setShowMotivo(true)}
            className="flex items-center gap-2 px-4 py-2 border border-error/30 text-error text-label-md hover:bg-error/10 transition-all ml-auto"
          >
            <span className="material-symbols-outlined text-[18px]">cancel</span>
            Cancelar
          </button>
        )}
      </div>
      {showMotivo && (
        <div className="flex items-center gap-2 bg-surface-container-high p-3 border border-outline-variant/20">
          <input
            type="text"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Motivo de cancelación (requerido)"
            className="flex-1 bg-surface border border-outline-variant/30 px-3 py-2 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-error"
            autoFocus
          />
          <button
            onClick={handleCancel}
            disabled={!motivo.trim()}
            className="px-4 py-2 bg-error text-on-error text-label-md font-bold hover:brightness-110 transition-all disabled:opacity-40"
          >
            Confirmar
          </button>
          <button
            onClick={() => { setShowMotivo(false); setMotivo('') }}
            className="px-4 py-2 border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container-high transition-all"
          >
            Volver
          </button>
        </div>
      )}
    </div>
  )
}
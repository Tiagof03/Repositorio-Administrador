import type { PedidoReciente } from '@/features/dashboard/types'

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: 'bg-primary-container/15 text-primary',
  CONFIRMADO: 'bg-primary-container/15 text-primary',
  EN_PREP: 'bg-tertiary-container/15 text-tertiary',
  ENTREGADO: 'bg-on-surface-variant/10 text-on-surface-variant',
  CANCELADO: 'bg-error-container/15 text-error',
}

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En Prep.',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

interface Props {
  pedidos: PedidoReciente[]
}

export default function RecientesTable({ pedidos }: Props) {
  return (
    <div className="bg-surface-container border border-outline-variant/20">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">history</span>
        <h3 className="text-label-md text-on-surface uppercase tracking-wider font-bold">
          Pedidos Recientes
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-outline-variant/10">
              <th className="px-6 py-3 text-label-sm text-on-surface-variant/60 uppercase tracking-wider font-medium">#</th>
              <th className="px-6 py-3 text-label-sm text-on-surface-variant/60 uppercase tracking-wider font-medium">Cliente</th>
              <th className="px-6 py-3 text-label-sm text-on-surface-variant/60 uppercase tracking-wider font-medium">Total</th>
              <th className="px-6 py-3 text-label-sm text-on-surface-variant/60 uppercase tracking-wider font-medium">Estado</th>
              <th className="px-6 py-3 text-label-sm text-on-surface-variant/60 uppercase tracking-wider font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((p) => (
              <tr
                key={p.id}
                className="border-b border-outline-variant/5 hover:bg-surface-variant/10 transition-colors"
              >
                <td className="px-6 py-4 text-label-sm font-bold text-on-surface">
                  #ORD-{String(p.id).padStart(4, '0')}
                </td>
                <td className="px-6 py-4 text-body-md text-on-surface">{p.usuarioEmail}</td>
                <td className="px-6 py-4 text-label-sm font-bold text-on-surface">${p.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[p.estadoCodigo] ?? 'bg-surface-variant/20 text-on-surface-variant'}`}>
                    {STATUS_LABELS[p.estadoCodigo] ?? p.estadoCodigo}
                  </span>
                </td>
                <td className="px-6 py-4 text-label-sm text-on-surface-variant/70">
                  {new Date(p.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-label-sm text-on-surface-variant/50">
                  No hay pedidos recientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

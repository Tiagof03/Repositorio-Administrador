import type { DashboardResponse } from '@/features/dashboard/types'

interface Props {
  data: DashboardResponse
}

export default function ResumenCards({ data }: Props) {
  const items = [
    {
      label: 'Ingresos Totales',
      value: `$${data.ingresosTotales.toFixed(2)}`,
      icon: 'payments',
      color: 'text-primary',
      bg: 'bg-primary-container/15',
      border: 'border-primary/20',
    },
    {
      label: 'Pedidos Totales',
      value: data.totalPedidos.toLocaleString(),
      icon: 'receipt_long',
      color: 'text-tertiary',
      bg: 'bg-tertiary-container/15',
      border: 'border-tertiary/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {items.map((item) => (
        <div
          key={item.label}
          className={`${item.bg} ${item.border} border p-6 transition-all hover:shadow-lg`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-label-sm text-on-surface-variant uppercase tracking-wider font-medium">
                {item.label}
              </p>
              <p className={`text-headline-xl font-extrabold mt-2 ${item.color}`}>
                {item.value}
              </p>
            </div>
            <div className={`w-12 h-12 flex items-center justify-center ${item.bg} rounded-lg`}>
              <span className={`material-symbols-outlined text-[28px] ${item.color}`}>
                {item.icon}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

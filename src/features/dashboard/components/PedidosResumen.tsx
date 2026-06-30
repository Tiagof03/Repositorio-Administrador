import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import type { DashboardResponse } from '@/features/dashboard/types'

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: '#eab308',
  CONFIRMADO: '#6366f1',
  EN_PREP: '#06b6d4',
  ENTREGADO: '#22c55e',
  CANCELADO: '#ef4444',
}

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendientes',
  CONFIRMADO: 'Confirmados',
  EN_PREP: 'En Preparación',
  ENTREGADO: 'Entregados',
  CANCELADO: 'Cancelados',
}

const PAGO_COLORS = ['#1644b7', '#285925', '#6366f1', '#eab308']

interface Props {
  pedidosPorEstado: DashboardResponse['pedidosPorEstado']
  totalPorFormaPago: DashboardResponse['totalPorFormaPago']
}

export default function PedidosResumen({ pedidosPorEstado, totalPorFormaPago }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Pedidos por estado — BarChart */}
      <div className="bg-surface-container p-6 border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">bar_chart</span>
          <h3 className="text-label-md text-on-surface uppercase tracking-wider font-bold">
            Pedidos por Estado
          </h3>
        </div>
        {pedidosPorEstado.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pedidosPorEstado.map((e) => ({ ...e, label: ESTADO_LABELS[e.estado] ?? e.estado }))}>
              <XAxis dataKey="label" tick={{ fill: '#8f706b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8f706b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#ffffff', border: '1px solid #e4beb8', borderRadius: 8 }}
                labelStyle={{ color: '#1b1c1a' }}
              />
              <Bar dataKey="cantidad" radius={[0, 0, 0, 0]}>
                {pedidosPorEstado.map((entry) => (
                  <Cell key={entry.estado} fill={ESTADO_COLORS[entry.estado] ?? '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-label-sm text-on-surface-variant/50 text-center py-8">Sin datos</p>
        )}
      </div>

      {/* Ingresos por forma de pago — PieChart */}
      <div className="bg-surface-container p-6 border border-outline-variant/20">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">account_balance_wallet</span>
          <h3 className="text-label-md text-on-surface uppercase tracking-wider font-bold">
            Ingresos por Forma de Pago
          </h3>
        </div>
        {totalPorFormaPago.length > 0 ? (
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie
                  data={totalPorFormaPago}
                  dataKey="total"
                  nameKey="formaPago"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                >
                  {totalPorFormaPago.map((_, i) => (
                    <Cell key={i} fill={PAGO_COLORS[i % PAGO_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#ffffff', border: '1px solid #e4beb8', borderRadius: 8 }}
                  labelStyle={{ color: '#1b1c1a' }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {totalPorFormaPago.map((item, i) => (
                <div key={item.formaPago} className="flex items-center gap-2">
                  <span className="w-3 h-3" style={{ backgroundColor: PAGO_COLORS[i % PAGO_COLORS.length] }} />
                  <span className="text-label-sm text-on-surface-variant uppercase">{item.formaPago}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-label-sm text-on-surface-variant/50 text-center py-8">Sin datos</p>
        )}
      </div>
    </div>
  )
}

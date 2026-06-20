import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { ProductoVendido } from '@/features/dashboard/types'

interface Props {
  productos: ProductoVendido[]
}

const TOP_COLORS = ['#eab308', '#94a3b8', '#cd7f32', '#1644b7', '#285925']

export default function ProductosTop({ productos }: Props) {
  const sorted = [...productos].sort((a, b) => b.totalVendido - a.totalVendido).slice(0, 10)
  const chartData = sorted.map((p) => ({ name: p.nombre, vendidos: p.totalVendido }))

  return (
    <div className="bg-surface-container p-6 border border-outline-variant/20">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-[20px] text-on-surface-variant">trending_up</span>
        <h3 className="text-label-md text-on-surface uppercase tracking-wider font-bold">
          Productos Más Vendidos
        </h3>
      </div>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 40)}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" tick={{ fill: '#8f706b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: '#5b403c', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={120}
            />
            <Tooltip
              contentStyle={{ background: '#ffffff', border: '1px solid #e4beb8', borderRadius: 8 }}
              labelStyle={{ color: '#1b1c1a' }}
              formatter={(value: number) => [value, 'Vendidos']}
            />
            <Bar dataKey="vendidos" radius={[0, 0, 0, 0]} barSize={20}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={TOP_COLORS[i % TOP_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-label-sm text-on-surface-variant/50 text-center py-8">
          No hay productos vendidos aún
        </p>
      )}
    </div>
  )
}

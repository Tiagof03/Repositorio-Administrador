import { useDashboardResumen } from '@/features/dashboard/hooks/useDashboard'
import ResumenCards from '@/features/dashboard/components/ResumenCards'
import PedidosResumen from '@/features/dashboard/components/PedidosResumen'
import ProductosTop from '@/features/dashboard/components/ProductosTop'
import RecientesTable from '@/features/dashboard/components/RecientesTable'
import { SkeletonDashboard } from '@/shared/Skeleton'

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardResumen()

  if (isLoading) {
    return <SkeletonDashboard />
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-[40px] text-on-surface-variant/20">error_outline</span>
        <p className="text-label-sm text-on-surface-variant/50">
          No se pudieron cargar los datos del dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-headline-lg font-extrabold text-on-surface">Dashboard</h1>
        <p className="text-label-sm text-on-surface-variant/60 mt-1">
          Resumen general del negocio
        </p>
      </div>

      <ResumenCards data={data} />
      <PedidosResumen
        pedidosPorEstado={data.pedidosPorEstado}
        totalPorFormaPago={data.totalPorFormaPago}
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2">
          <ProductosTop productos={data.productosMasVendidos} />
        </div>
        <div className="lg:col-span-3">
          <RecientesTable pedidos={data.pedidosRecientes} />
        </div>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import type { Order, OrderStatus } from '@/features/orders/types'
import { STATUS_LABELS, ORDER_STATUSES } from '@/features/orders/types'
import StatusBadge from '@/features/orders/components/StatusBadge'

const columnHelper = createColumnHelper<Order>()

interface OrdersTableProps {
  data: Order[]
  onSelectOrder: (order: Order) => void
  selectedOrderId: number | null
}

export default function OrdersTable({
  data,
  onSelectOrder,
  selectedOrderId,
}: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'creadoEn', desc: true },
  ])
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'todos'>(
    'todos',
  )

  const filteredData = useMemo(() => {
    if (statusFilter === 'todos') return data
    return data.filter((o) => o.estadoCodigo === statusFilter)
  }, [data, statusFilter])

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: 'Pedido',
        cell: (info) => (
          <span className="text-primary font-bold text-label-sm">
            #ORD-{String(info.getValue()).padStart(4, '0')}
          </span>
        ),
        size: 110,
      }),
      columnHelper.accessor('clienteNombre', {
        header: 'Cliente',
        cell: (info) => (
          <span className="text-on-surface font-medium">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('estadoCodigo', {
        header: 'Estado',
        cell: (info) => <StatusBadge status={info.getValue()} />,
        size: 180,
      }),
      columnHelper.accessor('items', {
        header: 'Items',
        cell: (info) => {
          const items = info.getValue()
          const summary = items
            .map((i) => `${i.nombreSnapshot} x${i.cantidad}`)
            .join(', ')
          return (
            <span
              className="text-on-surface-variant text-sm italic line-clamp-1 max-w-[260px]"
              title={summary}
            >
              {summary}
            </span>
          )
        },
        enableSorting: false,
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: (info) => (
          <span className="text-on-surface font-bold">
            ${info.getValue().toFixed(2)}
          </span>
        ),
        size: 100,
      }),
      columnHelper.accessor('creadoEn', {
        header: 'Hora',
        cell: (info) => {
          const date = new Date(info.getValue())
          return (
            <span className="text-on-surface-variant text-label-sm">
              {date.toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )
        },
        size: 80,
      }),
    ],
    [],
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filtros de estado */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-4 py-1.5 text-label-md transition-all shrink-0 ${
            statusFilter === 'todos'
              ? 'bg-primary-container text-on-primary-container font-bold'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Todos ({data.length})
        </button>
        {ORDER_STATUSES.map((s) => {
          const count = data.filter((o) => o.estadoCodigo === s).length
          if (count === 0) return null
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 text-label-md transition-all shrink-0 ${
                statusFilter === s
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {STATUS_LABELS[s]} ({count})
            </button>
          )
        })}
      </div>

      {/* Tabla */}
      <div className="border border-outline-variant/20 overflow-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-outline-variant/20">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left px-4 py-3 text-label-sm text-on-surface-variant uppercase tracking-wider bg-surface-container-high cursor-pointer select-none hover:text-on-surface transition-colors"
                    style={{
                      width: header.getSize() !== 150 ? header.getSize() : undefined,
                    }}
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() && (
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          {header.column.getIsSorted() === 'asc'
                            ? 'arrow_upward'
                            : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-16 text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[48px] block mb-3 opacity-30">
                    receipt_long
                  </span>
                  <p className="text-body-md">No hay pedidos para mostrar</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectOrder(row.original)}
                  className={`border-b border-outline-variant/10 cursor-pointer transition-all ${
                    selectedOrderId === row.original.id
                      ? 'bg-primary/5 border-l-2 border-l-primary'
                      : 'hover:bg-surface-container-high/50'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <span className="text-label-sm text-on-surface-variant">
            Página {table.getState().pagination.pageIndex + 1} de{' '}
            {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container-high disabled:opacity-30 transition-all"
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container-high disabled:opacity-30 transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

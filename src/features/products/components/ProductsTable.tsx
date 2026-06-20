import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table'
import { useState, useMemo } from 'react'
import type { Product } from '@/features/products/types'
import type { UnidadMedida } from '@/features/unidades-medida/types'
interface Props {
  data: Product[]
  isAdmin: boolean
  canEditStock: boolean
  unidades: UnidadMedida[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggle: (product: Product) => void
}
const columnHelper = createColumnHelper<Product>()
export default function ProductsTable({ data, isAdmin, canEditStock, unidades, onEdit, onDelete, onToggle }: Props) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<SortingState>([])
  const unidadMap = useMemo(
    () => new Map(unidades.map((u) => [u.id, u])),
    [unidades],
  )
  const columns = [
    columnHelper.display({
      id: 'imagen',
      header: '',
      cell: ({ row }) => {
        const src = row.original.imagenesUrl?.[0]
        return (
          <div className="w-14 h-14 bg-surface-variant/40 border border-outline-variant/20 overflow-hidden shrink-0">
            {src ? (
              <img
                src={src}
                alt={row.original.nombre}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-[24px]">
                  restaurant
                </span>
              </div>
            )}
          </div>
        )
      },
      size: 72,
    }),
    columnHelper.accessor('nombre', {
      header: 'Producto',
      cell: (info) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-on-surface font-bold text-body-md">{info.getValue()}</span>
          <span className="text-on-surface-variant/60 text-label-sm line-clamp-1">
            {info.row.original.descripcion}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('precioBase', {
      header: 'Precio',
      cell: (info) => (
        <span className="text-on-surface font-bold text-body-md tabular-nums">
          ${(info.getValue() ?? 0).toFixed(2)}
        </span>
      ),
      size: 120,
    }),
    columnHelper.accessor('stockCantidad', {
      header: 'Stock',
      cell: (info) => {
        const cantidad = info.getValue()
        const unidadId = info.row.original.unidadVentaId
        const unidad = unidadId ? unidadMap.get(unidadId) : null
        return (
          <span className="text-on-surface-variant text-body-md tabular-nums">
            {cantidad}{unidad ? ` ${unidad.simbolo}` : ''}
          </span>
        )
      },
      size: 120,
    }),
    columnHelper.accessor('disponible', {
      header: 'Estado',
      cell: (info) => {
        const disponible = info.getValue()
        return (
          <button
            onClick={() => canEditStock && onToggle(info.row.original)}
            disabled={!canEditStock}
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-label-sm font-label-sm uppercase tracking-wider transition-colors ${
              canEditStock ? 'cursor-pointer hover:brightness-110' : 'cursor-default'
            } ${
              disponible
                ? 'bg-tertiary-container/15 text-tertiary border border-tertiary/30'
                : 'bg-surface-variant/30 text-on-surface-variant border border-outline-variant/30'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                disponible ? 'bg-tertiary animate-pulse' : 'bg-on-surface-variant/50'
              }`}
            />
            {disponible ? 'Disponible' : 'No disponible'}
          </button>
        )
      },
      size: 170,
    }),
    ...(isAdmin || canEditStock
      ? [
          columnHelper.display({
            id: 'acciones',
            header: 'Acciones',
            cell: (info) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(info.row.original)}
                  className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  title="Editar"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(info.row.original)}
                    className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                )}
              </div>
            ),
            size: 120,
          }),
        ]
      : []),
  ]
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 },
    },
  })
  return (
    <div className="bg-surface-container-low border border-outline-variant/20 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="bg-surface-container-high border border-outline-variant/30 text-on-surface text-body-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-on-surface-variant/40"
            />
          </div>
          <div className="w-px h-4 bg-outline-variant/40" />
          <p className="text-label-md font-label-md text-on-surface-variant">
            Mostrando{' '}
            <span className="text-on-surface font-bold">
              {table.getFilteredRowModel().rows.length}
            </span>{' '}
            productos
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-surface-container-highest/30">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-label-md font-label-md text-on-surface-variant border-b border-outline-variant/20"
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.getCanSort() ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="flex items-center gap-1 cursor-pointer hover:text-on-surface transition-colors"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <span className="material-symbols-outlined text-[16px]">arrow_upward</span>,
                              desc: <span className="material-symbols-outlined text-[16px]">arrow_downward</span>,
                            }[header.column.getIsSorted() as string] ?? null}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">
                      restaurant_menu
                    </span>
                    <p className="text-body-md text-on-surface-variant/50">
                      No se encontraron productos
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-surface-variant/10 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 text-body-md">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      {table.getPageCount() > 1 && (
        <div className="p-4 bg-surface-container border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-label-md font-label-md text-on-surface-variant">
            Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-10 h-10 flex items-center justify-center text-label-md font-label-md transition-colors cursor-pointer ${
                  table.getState().pagination.pageIndex === i
                    ? 'bg-primary-container text-on-primary-container font-bold'
                    : 'border border-outline-variant/20 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-10 h-10 flex items-center justify-center border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
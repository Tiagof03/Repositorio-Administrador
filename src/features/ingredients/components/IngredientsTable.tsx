import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type ColumnFiltersState,
} from '@tanstack/react-table'
import { useState } from 'react'
import type { Ingredient } from '@/features/ingredients/types'

interface Props {
  data: Ingredient[]
  isAdmin: boolean
  onEdit: (ingredient: Ingredient) => void
  onDelete: (ingredient: Ingredient) => void
}

const columnHelper = createColumnHelper<Ingredient>()

export default function IngredientsTable({ data, isAdmin, onEdit, onDelete }: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => (
        <span className="text-on-surface-variant">#{info.getValue()}</span>
      ),
      size: 100,
    }),
    columnHelper.accessor('nombre', {
      header: 'Ingrediente',
      cell: (info) => (
        <span className="text-on-surface font-bold">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('descripcion', {
      header: 'Descripción',
      cell: (info) => {
        const value = info.getValue()
        return value ? (
          <span className="text-on-surface-variant text-body-md line-clamp-2 max-w-xs">
            {value}
          </span>
        ) : (
          <span className="text-on-surface-variant/30 text-body-md">—</span>
        )
      },
      size: 250,
    }),
    columnHelper.accessor('es_alergeno', {
      header: 'Alérgeno',
      cell: (info) => {
        const value = info.getValue()
        return value ? (
          <span className="inline-flex items-center gap-1.5 bg-error-container/20 text-error border border-error/30 px-3 py-1 text-label-sm font-label-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            Sí
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-tertiary-container/15 text-tertiary border border-tertiary/30 px-3 py-1 text-label-sm font-label-sm uppercase tracking-wider">
            No
          </span>
        )
      },
      size: 140,
    }),
    ...(isAdmin
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
                <button
                  onClick={() => onDelete(info.row.original)}
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
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
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 },
    },
  })

  return (
    <div className="bg-surface-container-low border border-outline-variant/20 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 bg-surface-container border-b border-outline-variant/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar ingrediente..."
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
            ingredientes
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
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center gap-3">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">
                      egg_alt
                    </span>
                    <p className="text-body-md text-on-surface-variant/50">
                      No se encontraron ingredientes
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
import { useState } from 'react'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import type { AdminUser } from '@/features/admin-users/types'
const columnHelper = createColumnHelper<AdminUser>()
interface UsersTableProps {
  data: AdminUser[]
  onEdit: (user: AdminUser) => void
  onRoles: (user: AdminUser) => void
  onDelete: (user: AdminUser) => void
}
export default function UsersTable({ data, onEdit, onRoles, onDelete }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const columns = [
    columnHelper.accessor('email', {
      header: 'Email',
      cell: (info) => (
        <span className="text-body-md text-on-surface font-medium">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('nombre', {
      header: 'Nombre',
      cell: (info) => (
        <span className="text-body-md text-on-surface">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('apellido', {
      header: 'Apellido',
      cell: (info) => (
        <span className="text-body-md text-on-surface">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor('celular', {
      header: 'Celular',
      cell: (info) => (
        <span className="text-body-md text-on-surface-variant">
          {info.getValue() ?? '—'}
        </span>
      ),
    }),
    columnHelper.accessor('roles', {
      header: 'Roles',
      cell: (info) => (
        <div className="flex gap-1 flex-wrap">
          {info.getValue().length === 0 ? (
            <span className="text-label-sm text-on-surface-variant/50">—</span>
          ) : (
            info.getValue().map((r) => (
              <span
                key={r}
                className="bg-primary-container/15 text-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider"
              >
                {r}
              </span>
            ))
          )}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'acciones',
      header: '',
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(row.original)}
            className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
            title="Editar"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
          <button
            onClick={() => onRoles(row.original)}
            className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
            title="Roles"
          >
            <span className="material-symbols-outlined text-[18px]">badge</span>
          </button>
          <button
            onClick={() => onDelete(row.original)}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 transition-all cursor-pointer"
            title="Eliminar"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      ),
    }),
  ]
    const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full max-w-xs">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[20px]">
          search
        </span>
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar usuarios..."
          className="w-full bg-surface-container border border-outline-variant/20 pl-10 pr-4 py-2.5 text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      <div className="overflow-x-auto border border-outline-variant/10">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="bg-surface-container-high">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    onClick={h.column.getToggleSortingHandler()}
                    className="px-4 py-3 text-left text-label-sm text-on-surface-variant uppercase tracking-wider font-bold cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() && (
                        <span className="material-symbols-outlined text-[14px]">
                          {h.column.getIsSorted() === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center">
                  <span className="material-symbols-outlined text-[40px] text-on-surface-variant/30">person_off</span>
                  <p className="text-body-md text-on-surface-variant/60 mt-2">No se encontraron usuarios</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-label-sm text-on-surface-variant">
            Pág. {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border border-outline-variant/20 text-label-sm text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-30 cursor-pointer"
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border border-outline-variant/20 text-label-sm text-on-surface-variant hover:bg-surface-container-high transition-all disabled:opacity-30 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
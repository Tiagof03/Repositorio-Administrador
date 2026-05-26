import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type ExpandedState,
} from '@tanstack/react-table'
import { useState, Fragment } from 'react'
import type { Category } from '@/features/categorias/types'
interface Props {
  data: Category[]
  isAdmin: boolean
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onAddSub: (parentId: number) => void
}
const columnHelper = createColumnHelper<Category>()
export default function CategoriesTable({
  data,
  isAdmin,
  onEdit,
  onDelete,
}: Props) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const columns = [
    columnHelper.display({
      id: 'expand',
      header: '',
      cell: ({ row }) => {
        const hasSubs = row.getCanExpand()
        if (!hasSubs) return <span className="w-6" />
        return (
          <button
            onClick={row.getToggleExpandedHandler()}
            className="p-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[20px] transition-transform"
              style={{
                transform: row.getIsExpanded()
                  ? 'rotate(90deg)'
                  : 'rotate(0deg)',
              }}
            >
              chevron_right
            </span>
          </button>
        )
      },
      size: 48,
    }),
    columnHelper.accessor('imagen_url', {
      header: '',
      cell: (info) => {
        const url = info.getValue()
        return url ? (
          <img
            src={url}
            alt=""
            className="w-10 h-10 object-cover border border-outline-variant/20"
          />
        ) : (
          <div className="w-10 h-10 bg-surface-variant/40 border border-outline-variant/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
              category
            </span>
          </div>
        )
      },
      size: 60,
    }),
    columnHelper.accessor('nombre', {
      header: 'Nombre Categoría',
      cell: ({ row, getValue }) => (
        <div
          style={{ paddingLeft: `${row.depth * 24}px` }}
          className="flex items-center gap-2"
        >
          {row.depth > 0 && (
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
              subdirectory_arrow_right
            </span>
          )}
          <span
            className={`text-body-md ${
              row.depth === 0
                ? 'text-on-surface font-bold'
                : 'text-on-surface-variant'
            }`}
          >
            {getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'items',
      header: 'Subcategorías',
      cell: ({ row }) => {
        if (row.depth > 0) return '-'
        return (
          <span className="text-on-surface-variant text-body-md">
            {row.original.hijos?.length ?? 0}
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
                  <span className="material-symbols-outlined text-[20px]">
                    edit
                  </span>
                </button>
                <button
                  onClick={() => onDelete(info.row.original)}
                  className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                  title="Eliminar"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    delete
                  </span>
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
      globalFilter,
      expanded,
    },
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.hijos ?? [],
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
              placeholder="Buscar categoría..."
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
            categorías
          </p>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-surface-container-highest/30"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-label-md font-label-md text-on-surface-variant border-b border-outline-variant/20"
                    style={{
                      width:
                        header.getSize() !== 150
                          ? header.getSize()
                          : undefined,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                      category
                    </span>
                    <p className="text-body-md text-on-surface-variant/50">
                      No se encontraron categorías
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                return (
                  <Fragment key={row.id}>
                    <tr className="hover:bg-surface-variant/10 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-body-md"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
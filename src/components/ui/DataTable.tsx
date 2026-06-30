"use client"

import { useState, useMemo } from "react"
import { Card } from "./Card"
import { Button } from "./Button"
import { Skeleton } from "./Skeleton"
import { cn } from "@/lib/utils"
import {
  Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2,
  ArrowUpDown, ArrowUp, ArrowDown, Download, CheckSquare,
  Square, ChevronDown, X, FileSpreadsheet
} from "lucide-react"

interface Column {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  className?: string
  width?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  search?: string
  onSearchChange?: (v: string) => void
  searchPlaceholder?: string
  onAdd?: () => void
  onEdit?: (row: any) => void
  onDelete?: (row: any) => void
  onBulkDelete?: (ids: string[]) => void
  addLabel?: string
  page?: number
  totalPages?: number
  onPageChange?: (p: number) => void
  emptyMessage?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
  onSort?: (field: string, order: "asc" | "desc") => void
  stickyFirst?: number
}

export function DataTable({
  columns, data, loading, search, onSearchChange, searchPlaceholder = "Cari...",
  onAdd, onEdit, onDelete, onBulkDelete, addLabel = "Tambah",
  page, totalPages, onPageChange, emptyMessage = "Tidak ada data",
  sortField: externalSortField, sortOrder: externalSortOrder, onSort, stickyFirst = 1,
}: DataTableProps) {
  const [internalSortField, setInternalSortField] = useState<string>("")
  const [internalSortOrder, setInternalSortOrder] = useState<"asc" | "desc">("asc")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const activeSortField = externalSortField ?? internalSortField
  const activeSortOrder = externalSortOrder ?? internalSortOrder

  const handleSort = (key: string) => {
    if (onSort) {
      const newOrder = activeSortField === key && activeSortOrder === "asc" ? "desc" : "asc"
      onSort(key, newOrder)
    } else {
      setInternalSortField((prev) => prev === key && internalSortOrder === "asc" ? "desc" : "asc")
      setInternalSortOrder((prev) => activeSortField === key && prev === "asc" ? "desc" : "asc")
    }
  }

  const sortedData = useMemo(() => {
    if (onSort) return data
    if (!internalSortField) return data
    return [...data].sort((a: any, b: any) => {
      const aVal = a[internalSortField] ?? ""
      const bVal = b[internalSortField] ?? ""
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true })
      return internalSortOrder === "asc" ? cmp : -cmp
    })
  }, [data, internalSortField, internalSortOrder, onSort])

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(sortedData.map((r: any) => r.id).filter(Boolean)))
    }
  }

  const exportCSV = () => {
    const headers = columns.map((c) => c.label).join(",")
    const rows = sortedData.map((row: any) =>
      columns.map((c) => {
        const val = row[c.key]
        const str = val !== null && val !== undefined ? String(val).replace(/"/g, '""') : ""
        return `"${str}"`
      }).join(",")
    )
    const csv = [headers, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "export.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  const hasActions = !!(onEdit || onDelete || onBulkDelete)
  const hasSelect = !!onBulkDelete

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {onSearchChange && (
          <div className="relative w-full sm:w-72 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search || ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15 transition-all"
            />
            {search && (
              <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {selectedRows.size > 0 && onBulkDelete && (
            <Button variant="danger" size="sm" onClick={() => { onBulkDelete(Array.from(selectedRows)); setSelectedRows(new Set()) }}>
              Hapus ({selectedRows.size})
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={exportCSV} title="Export CSV">
            <FileSpreadsheet className="w-3.5 h-3.5" />
          </Button>
          {onAdd && (
            <Button onClick={onAdd} size="sm">
              <Plus className="w-4 h-4 mr-1.5" />{addLabel}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/80 sticky top-0 z-10">
                {hasSelect && (
                  <th className="px-4 py-3 w-10">
                    <button onClick={toggleAll} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {selectedRows.size === sortedData.length && sortedData.length > 0
                        ? <CheckSquare className="w-4 h-4 text-primary-600" />
                        : <Square className="w-4 h-4" />
                      }
                    </button>
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider text-left",
                      col.sortable !== false && "cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
                      idx < stickyFirst && "sticky left-0 bg-gray-50/80 dark:bg-gray-900/80 z-10",
                      col.className,
                    )}
                    style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable !== false && (
                        <span className="inline-flex flex-col text-gray-300 dark:text-gray-600">
                          {activeSortField === col.key ? (
                            activeSortOrder === "asc"
                              ? <ArrowUp className="w-3 h-3 text-primary-600" />
                              : <ArrowDown className="w-3 h-3 text-primary-600" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {hasActions && (
                  <th className="px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider text-right sticky right-0 bg-gray-50/80 dark:bg-gray-900/80 z-10">
                    Aksi
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                    {hasSelect && <td className="px-4 py-3"><Skeleton className="w-4 h-4" /></td>}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                    {hasActions && <td className="px-4 py-3"><Skeleton className="h-8 w-16 ml-auto" /></td>}
                  </tr>
                ))
              ) : sortedData.length > 0 ? (
                sortedData.map((row: any, i: number) => (
                  <tr
                    key={row.id || i}
                    className={cn(
                      "border-b border-gray-50 dark:border-gray-800/50 transition-colors duration-100",
                      "hover:bg-gray-50/80 dark:hover:bg-gray-800/40",
                      selectedRows.has(row.id) && "bg-primary-50/50 dark:bg-primary-900/10"
                    )}
                  >
                    {hasSelect && (
                      <td className="px-4 py-3 w-10">
                        <button onClick={() => row.id && toggleRow(row.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
                          {selectedRows.has(row.id)
                            ? <CheckSquare className="w-4 h-4 text-primary-600" />
                            : <Square className="w-4 h-4" />
                          }
                        </button>
                      </td>
                    )}
                    {columns.map((col, idx) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-4 py-3 text-gray-700 dark:text-gray-300",
                          idx < stickyFirst && "sticky left-0 bg-white dark:bg-gray-950 z-10",
                          col.className,
                        )}
                        style={col.width ? { maxWidth: col.width, overflow: "hidden", textOverflow: "ellipsis" } : undefined}
                        title={typeof row[col.key] === "string" ? row[col.key] : undefined}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key] ?? "-"}
                      </td>
                    ))}
                    {hasActions && (
                      <td className="px-4 py-3 sticky right-0 bg-white dark:bg-gray-950 z-10">
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (hasSelect ? 1 : 0) + (hasActions ? 1 : 0)} className="py-16 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                      <span>{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination + Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500">
          {selectedRows.size > 0
            ? `${selectedRows.size} dipilih`
            : `${sortedData.length} data`
          }
        </p>
        {totalPages && totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => onPageChange?.(1)}
              disabled={page === 1}
              title="Halaman pertama"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <ChevronLeft className="w-3.5 h-3.5 -ml-2" />
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => onPageChange?.(Math.max(1, (page || 1) - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-gray-500 min-w-[80px] text-center font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline" size="sm"
              onClick={() => onPageChange?.(Math.min(totalPages, (page || 1) + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => onPageChange?.(totalPages)}
              disabled={page === totalPages}
              title="Halaman terakhir"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <ChevronRight className="w-3.5 h-3.5 -ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

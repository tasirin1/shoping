"use client"

import { useState } from "react"
import { Card } from "./Card"
import { Button } from "./Button"
import { Input } from "./Input"
import { cn } from "@/lib/utils"
import { Search, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, Loader2 } from "lucide-react"
import { Modal } from "./Modal"
import { Skeleton } from "./Skeleton"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  className?: string
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
  addLabel?: string
  page?: number
  totalPages?: number
  onPageChange?: (p: number) => void
  emptyMessage?: string
}

export function DataTable({
  columns, data, loading, search, onSearchChange, searchPlaceholder = "Cari...",
  onAdd, onEdit, onDelete, addLabel = "Tambah", page, totalPages, onPageChange, emptyMessage = "Tidak ada data",
}: DataTableProps) {
  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        {onSearchChange && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={search || ""} onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/15"
            />
          </div>
        )}
        <div className="sm:ml-auto" />
        {onAdd && <Button onClick={onAdd} size="sm"><Plus className="w-4 h-4 mr-1.5" />{addLabel}</Button>}
      </div>

      {/* Table */}
      <Card padding="sm" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                {columns.map((col) => (
                  <th key={col.key} className={cn("text-left py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider", col.className)}>
                    {col.label}
                  </th>
                ))}
                {(onEdit || onDelete) && <th className="text-right py-3 px-4 font-medium text-gray-500 text-xs uppercase tracking-wider">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800/50">
                    {columns.map((col) => (
                      <td key={col.key} className="py-3 px-4"><Skeleton className="h-4 w-full" /></td>
                    ))}
                    {(onEdit || onDelete) && <td className="py-3 px-4"><Skeleton className="h-8 w-16 ml-auto" /></td>}
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className={cn("py-3 px-4", col.className)}>
                        {col.render ? col.render(row[col.key], row) : row[col.key] ?? "-"}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && <button onClick={() => onEdit(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>}
                          {onDelete && <button onClick={() => onDelete(row)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + ((onEdit || onDelete) ? 1 : 0)} className="py-10 text-center text-gray-400 text-sm">
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button variant="outline" size="sm" onClick={() => onPageChange?.(Math.max(1, (page || 1) - 1))} disabled={page === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-xs text-gray-500">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => onPageChange?.(Math.min(totalPages, (page || 1) + 1))} disabled={page === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

// Form field component for modal forms
interface FormFieldProps {
  label: string
  children: React.ReactNode
  required?: boolean
}

export function FormField({ label, children, required }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}

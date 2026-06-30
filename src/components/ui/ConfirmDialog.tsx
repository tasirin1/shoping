"use client"

import { Modal } from "./Modal"
import { Button } from "./Button"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  variant?: "danger" | "primary"
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Hapus",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div className={`w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
          variant === "danger" 
            ? "bg-red-50 dark:bg-red-900/20" 
            : "bg-primary-50 dark:bg-primary-900/20"
        }`}>
          <AlertTriangle className={`w-6 h-6 ${
            variant === "danger" 
              ? "text-red-500" 
              : "text-primary-500"
          }`} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} fullWidth disabled={loading}>
            Batal
          </Button>
          <Button 
            variant={variant === "danger" ? "danger" : "primary"} 
            onClick={onConfirm} 
            fullWidth 
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

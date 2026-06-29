"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { useEffect, useCallback } from "react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
}

export function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
  }, [onClose])

  useEffect(() => {
    if (open) { document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden" }
    else { document.body.style.overflow = "" }
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = "" }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 animate-fadeIn" onClick={onClose} />
      <div className={cn(
        "relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn",
        { "max-w-sm": size === "sm", "max-w-md": size === "md", "max-w-lg": size === "lg", "max-w-2xl": size === "xl" }
      )}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

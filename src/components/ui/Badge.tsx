"use client"

import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300": variant === "default",
          "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400": variant === "success",
          "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400": variant === "warning",
          "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400": variant === "danger",
          "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400": variant === "info",
        },
        className
      )}
    >
      {children}
    </span>
  )
}

"use client"

import { ThemeProvider } from "./ThemeProvider"
import { ThemeInitializer } from "./ThemeInitializer"
import { ToastProvider } from "@/components/ui/Toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeInitializer>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeInitializer>
    </ThemeProvider>
  )
}

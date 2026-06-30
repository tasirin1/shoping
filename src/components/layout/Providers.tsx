"use client"

import { Suspense } from "react"
import { ThemeProvider } from "./ThemeProvider"
import { ThemeInitializer } from "./ThemeInitializer"
import { ToastProvider } from "@/components/ui/Toast"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { Skeleton } from "@/components/ui/Skeleton"

function ProvidersSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <div className="h-16 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950" />
      <div className="flex-1 p-4">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 rounded-2xl mb-4" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Suspense fallback={<ProvidersSkeleton />}>
          <ThemeInitializer>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeInitializer>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

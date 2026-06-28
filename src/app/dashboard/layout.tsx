import { Suspense } from "react"
import { Skeleton } from "@/components/ui/Skeleton"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-16 max-w-7xl mx-auto px-4">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      </div>
    }>
      {children}
    </Suspense>
  )
}

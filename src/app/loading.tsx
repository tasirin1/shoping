import { Skeleton } from "@/components/ui/Skeleton"

export default function RootLoading() {
  return (
    <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto">
      <div className="space-y-6">
        <Skeleton className="h-[400px] md:h-[500px] w-full rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

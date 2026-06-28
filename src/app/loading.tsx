import { GameGridSkeleton } from "@/components/ui/Skeleton"

export default function RootLoading() {
  return (
    <div className="pt-20 pb-12">
      {/* Hero skeleton */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="skeleton-pulse h-6 w-32 mx-auto rounded-full" />
          <div className="skeleton-pulse h-10 w-72 mx-auto rounded-xl" />
          <div className="skeleton-pulse h-10 w-full rounded-2xl" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="skeleton-pulse h-6 w-32 mb-5" />
        <GameGridSkeleton />
      </div>
    </div>
  )
}

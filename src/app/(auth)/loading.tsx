import { Skeleton } from "@/components/ui/Skeleton"

export default function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <Skeleton className="h-12 w-12 rounded-2xl mx-auto mb-4" />
        <Skeleton className="h-8 w-48 mx-auto mb-8" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    </div>
  )
}

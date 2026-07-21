import { TakeCardSkeleton } from "@/components/skeletons/take-card-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function FeedLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-64" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <TakeCardSkeleton />
        <TakeCardSkeleton />
        <TakeCardSkeleton />
        <TakeCardSkeleton />
        <TakeCardSkeleton />
        <TakeCardSkeleton />
      </div>
    </div>
  )
}

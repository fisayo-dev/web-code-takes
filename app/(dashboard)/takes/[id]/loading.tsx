import { CommentSkeleton } from "@/components/skeletons/comment-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function TakeDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />

      <div className="neo-card bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2 w-24" />
          </div>
        </div>

        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4" />

        <div className="flex flex-wrap gap-1.5 mt-3 mb-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <Skeleton className="h-2.5 w-8" />
          <Skeleton className="h-2.5 w-8" />
        </div>
      </div>

      <div className="neo-card bg-card p-6">
        <Skeleton className="h-2.5 w-28 mb-4" />

        <div className="flex gap-2 mb-6">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-16" />
        </div>

        <div className="flex flex-col gap-4">
          <CommentSkeleton />
          <CommentSkeleton />
          <CommentSkeleton />
        </div>
      </div>
    </div>
  )
}

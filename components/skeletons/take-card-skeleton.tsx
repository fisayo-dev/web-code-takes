import { Skeleton } from "@/components/ui/skeleton"

interface TakeCardSkeletonProps {
  layout?: "grid" | "list"
}

export function TakeCardSkeleton({ layout = "grid" }: TakeCardSkeletonProps) {
  return (
    <div className="neo-card bg-card p-4">
      <div className={`flex-1 ${layout === "list" ? "grid items-start gap-3" : ""}`}>
        <div className={layout === "list" ? "flex items-center gap-2 shrink-0" : "flex items-center gap-2 mb-3"}>
          <Skeleton className="size-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2 w-24" />
          </div>
        </div>

        <div className={layout === "list" ? "flex-1 min-w-0" : ""}>
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-3/4" />

          <div className="flex flex-wrap gap-1.5 mt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-14" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-3 mt-auto">
        <Skeleton className="h-2.5 w-8" />
        <Skeleton className="h-2.5 w-8" />
      </div>
    </div>
  )
}

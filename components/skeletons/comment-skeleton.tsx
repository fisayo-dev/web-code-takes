import { Skeleton } from "@/components/ui/skeleton"

export function CommentSkeleton() {
  return (
    <div className="border-b border-border pb-4 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 mb-2">
        <Skeleton className="size-8 rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-2 w-14" />
        </div>
      </div>
      <Skeleton className="h-2.5 w-full" />
    </div>
  )
}

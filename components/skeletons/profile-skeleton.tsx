import { Skeleton } from "@/components/ui/skeleton"

interface ProfileSkeletonProps {
  isOwnProfile?: boolean
}

export function ProfileSkeleton({ isOwnProfile = false }: ProfileSkeletonProps) {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-4 w-32" />

      {isOwnProfile ? (
        <div className="flex flex-col md:grid grid-cols-12 gap-10">
          <div className="neo-card bg-card p-6 col-span-3">
            <div className="grid md:flex md:flex-col items-center gap-3 sm:flex-row">
              <Skeleton className="size-20 rounded-full" />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          </div>

          <div className="neo-card bg-card p-6 col-span-9">
            <Skeleton className="h-2.5 w-20 mb-4" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="h-2.5 w-32" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="neo-card bg-card p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Skeleton className="size-20 rounded-full" />
              <div className="flex flex-col items-center gap-2 sm:items-start">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          <div className="neo-card bg-card p-6">
            <Skeleton className="h-2.5 w-20 mb-4" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-2.5 w-24" />
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-2.5 w-14" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-4">
        <Skeleton className="h-2.5 w-20" />
        <div className="flex flex-col gap-4">
          <div className="neo-card bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-2 w-24" />
              </div>
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="neo-card bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Skeleton className="size-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-2 w-24" />
              </div>
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  )
}

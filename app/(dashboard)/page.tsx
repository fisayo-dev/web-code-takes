"use client"

import { useUser } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-64 neo-card-sm" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-40 w-full neo-card-sm" />
          <Skeleton className="h-40 w-full neo-card-sm" />
          <Skeleton className="h-40 w-full neo-card-sm" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="neo-card bg-white p-6">
        <h1 className="text-xl font-bold uppercase tracking-tight">
          Welcome{user ? `, ${user.name}` : ""}!
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          This is your feed. Takes will appear here soon.
        </p>
      </div>

      <div className="neo-card bg-white p-6">
        <p className="text-xs text-muted-foreground text-center py-8">
          No takes yet. Be the first to post one.
        </p>
      </div>
    </div>
  )
}

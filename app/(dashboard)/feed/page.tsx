"use client"

import { useUser } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatCenteredIcon, NotepadIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export default function FeedPage() {
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
      <div className="p-6 flex flex-col items-center gap-2">
        <ChatCenteredIcon className="text-muted-foreground inline-block w-70 h-70" />
        <p className="text-xs text-muted-foreground text-center">
          No takes yet. Be the first to post one.
        </p>
        <Button  className="my-4">
          Post a take
        </Button>
      </div>
    </div>
  )
}

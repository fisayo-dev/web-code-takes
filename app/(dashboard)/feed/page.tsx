"use client"

import { useEffect, useState } from "react"
import { useUser } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatCenteredIcon, GridFourIcon, ListIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { TakeCard } from "@/components/take-card"
import { getFeedTakes } from "@/lib/api"
import type { Take } from "@/lib/types"
import Link from "next/link"

export default function FeedPage() {
  const { isLoading: isUserLoading } = useUser()
  const [takes, setTakes] = useState<Take[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [layout, setLayout] = useState<"grid" | "list">("grid")

  useEffect(() => {
    getFeedTakes()
      .then((data) => {
        setTakes(data)
        setIsLoading(false)
      })
      .catch(() => {
        setError("Failed to load takes")
        setIsLoading(false)
      })
  }, [])

  if (isUserLoading || isLoading) {
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

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold uppercase tracking-tight">Feed</h1>
        <div className="flex gap-1">
          <button
            onClick={() => setLayout("grid")}
            className={`p-1.5 rounded transition-colors ${
              layout === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GridFourIcon className="size-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`p-1.5 rounded transition-colors ${
              layout === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListIcon className="size-4" />
          </button>
        </div>
      </div>

      {takes.length === 0 ? (
        <div className="p-6 flex flex-col items-center gap-2">
          <ChatCenteredIcon className="text-muted-foreground inline-block w-70 h-70" />
          <p className="text-xs text-muted-foreground text-center">
            No takes yet. Be the first to post one.
          </p>
          <Link href="/create">
            <Button className="my-4">Post a take</Button>
          </Link>
        </div>
      ) : (
        <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
          {takes.map((take) => (
            <TakeCard key={take.id} take={take} layout={layout} />
          ))}
        </div>
      )}
    </div>
  )
}

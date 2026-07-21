"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useUser } from "@/hooks/use-user"
import { TakeCardSkeleton } from "@/components/skeletons/take-card-skeleton"
import { ChatCenteredIcon, GridFourIcon, ListIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { TakeCard } from "@/components/take-card"
import { getFeedTakes } from "@/lib/api"
import type { Take } from "@/lib/types"
import Link from "next/link"
import { FEED_PER_PAGE } from "@/constants"
import { BookOpenIcon } from "@phosphor-icons/react/dist/ssr"
import { useGsapFadeIn } from "@/hooks/use-gsap"

export default function FeedPage() {
  const { isLoading: isUserLoading } = useUser()
  const [takes, setTakes] = useState<Take[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingInitial, setIsLoadingInitial] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [layout, setLayout] = useState<"grid" | "list">("grid")
  const sentinelRef = useRef<HTMLDivElement>(null)

  const headerRef = useGsapFadeIn({ selector: ":scope > *", y: 16, duration: 0.4, stagger: 0.08 })
  const gridRef = useGsapFadeIn({ selector: ":scope > *", y: 24, duration: 0.4, stagger: 0.06, delay: 0.15 })

  useEffect(() => {
    getFeedTakes(0, FEED_PER_PAGE)
      .then((result) => {
        setTakes(result.items)
        setHasMore(result.items.length < result.total)
        setPage(1)
        setIsLoadingInitial(false)
      })
      .catch(() => {
        setError("Failed to load takes")
        setIsLoadingInitial(false)
      })
  }, [])

  const fetchMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      const result = await getFeedTakes(page, FEED_PER_PAGE)
      setTakes((prev) => [...prev, ...result.items])
      setHasMore((page + 1) * FEED_PER_PAGE < result.total)
      setPage((p) => p + 1)
    } catch {
    } finally {
      setIsLoadingMore(false)
    }
  }, [page, isLoadingMore, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchMore()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, fetchMore])

  if (isUserLoading || isLoadingInitial) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-64" />
          <div className="flex gap-1">
            <div className="p-1.5" />
            <div className="p-1.5" />
          </div>
        </div>
        <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
          {Array.from({ length: 6 }).map((_, i) => (
            <TakeCardSkeleton key={i} layout={layout} />
          ))}
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
      <div ref={headerRef} className="flex items-center justify-between">
        <h1 className="flex items-center space-x-2 text-lg font-bold uppercase tracking-tight">
          <BookOpenIcon className="size-6" />
          <span>Feed</span>
        </h1>
        <div className="flex gap-1">
          <button
            onClick={() => setLayout("grid")}
            className={`p-1.5 rounded-lg transition-colors ${
              layout === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GridFourIcon className="size-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`p-1.5 rounded-lg transition-colors ${
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
        <>
          <div ref={gridRef} className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
            {takes.map((take) => (
              <TakeCard key={take.id} take={take} layout={layout} />
            ))}
          </div>

          {isLoadingMore && (
            <div className={layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
              {Array.from({ length: 3 }).map((_, i) => (
                <TakeCardSkeleton key={i} layout={layout} />
              ))}
            </div>
          )}

          {hasMore && <div ref={sentinelRef} className="h-4" />}
        </>
      )}
    </div>
  )
}

"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { avatarUrl } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TakeCardSkeleton } from "@/components/skeletons/take-card-skeleton"
import { ArrowLeft, NotepadIcon, Pencil } from "@phosphor-icons/react"
import Link from "next/link"
import { TakeCard } from "@/components/take-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { Button } from "@/components/ui/button"
import { getTakesByUsername } from "@/lib/api"
import { useUser } from "@/hooks/use-user"
import type { Take, User } from "@/lib/types"
import { TAKES_PER_PAGE } from "@/constants"

interface ProfileViewProps {
  profile: User | null
  takes: Take[]
  totalTakes: number
  isOwnProfile: boolean
  error?: string
}

export function ProfileView({ profile, takes, totalTakes, isOwnProfile, error }: ProfileViewProps) {
  const [allTakes, setAllTakes] = useState<Take[]>(takes)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(takes.length < totalTakes)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [profileData, setProfileData] = useState(profile)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { updateCachedUser } = useUser()

  const handleUpdate = (updater: (prev: User) => User) => {
    setProfileData((prev) => (prev ? updater(prev) : prev))
    updateCachedUser(updater)
  }

  // // const handleUpdate = (updater: (prev: User) => User) => {
  //   setCurrentProfile((prev) => (prev ? updater(prev) : prev))
  //   updateCachedUser(updater)
  // }

  const fetchMore = useCallback(async () => {
    if (!profile || isLoadingMore || !hasMore) return
    setIsLoadingMore(true)
    try {
      const result = await getTakesByUsername(profile.username, page, TAKES_PER_PAGE)
      setAllTakes((prev) => [...prev, ...result.items])
      setHasMore((page + 1) * TAKES_PER_PAGE < result.total)
      setPage((p) => p + 1)
    } catch {
    } finally {
      setIsLoadingMore(false)
    }
  }, [profile, page, isLoadingMore, hasMore])

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

  if (error || !profileData) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">{error || "Could not load profile"}</p>
        <Link href="/feed" className="text-xs font-semibold text-primary hover:underline">
          Back to feed
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/feed"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="size-3.5" />
        Back to feed
      </Link>

      {isOwnProfile ? (
        <div className="flex flex-col md:grid grid-cols-12 gap-10">
          <div className="neo-card bg-card p-6 col-span-3">
            <div className="grid md:flex md:flex-col items-center gap-3 sm:flex-row">
              <Avatar size="xl" className="mx-auto md:mx-0 flex items-center">
                <AvatarImage src={avatarUrl(profileData.username, 100)} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-lg font-bold uppercase tracking-tight">{profileData.name}</h1>
                <p className="text-xs text-muted-foreground">@{profileData.username}</p>
                <p className="mt-1 text-[10px] text-primary font-semibold uppercase tracking-widest">
                  This is you
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditDialog(true)}
              className="w-full mt-4"
            >
              <Pencil className="size-3" />
              Edit Profile
            </Button>
          </div>

          <div className="neo-card bg-card p-6 col-span-9">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-xs">Username</span>
                <span className="font-semibold text-xs">@{profileData.username}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-xs">Email</span>
                <span className="font-semibold text-xs">{profileData.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Joined</span>
                <span className="font-semibold text-xs">
                  {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="neo-card bg-card p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Avatar size="xl">
                <AvatarImage src={avatarUrl(profileData.username, 100)} alt={profileData.name} />
                <AvatarFallback>{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-lg font-bold uppercase tracking-tight">{profileData.name}</h1>
                <p className="text-xs text-muted-foreground">@{profileData.username}</p>
              </div>
            </div>
          </div>

          <div className="neo-card bg-card p-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-xs">Username</span>
                <span className="font-semibold text-xs">@{profileData.username}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-xs">Email</span>
                <span className="font-semibold text-xs">Hidden</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Joined</span>
                <span className="font-semibold text-xs">
                  {new Date(profileData.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Takes ({totalTakes})
        </h2>

        {allTakes.length === 0 ? (
          <div className="neo-card bg-card p-6">
            <div className="flex flex-col items-center gap-2 py-4">
              <NotepadIcon className="text-muted-foreground size-8" />
              <p className="text-xs text-muted-foreground text-center">
                {isOwnProfile ? "You haven't posted any takes yet." : "No takes yet."}
              </p>
              {isOwnProfile && (
                <Link href="/create" className="text-xs font-semibold text-primary hover:underline mt-2">
                  Post your first take
                </Link>
              )}
            </div>
          </div>
        ) : (
          <>
            {allTakes.map((take) => (
              <TakeCard key={take.id} take={take} />
            ))}

            {isLoadingMore && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <TakeCardSkeleton key={i} />
                ))}
              </div>
            )}

            {hasMore && <div ref={sentinelRef} className="h-4" />}
          </>
        )}
      </div>

      {isOwnProfile && (
        <EditProfileDialog
          open={showEditDialog}
          onClose={() => setShowEditDialog(false)}
          profile={profileData}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

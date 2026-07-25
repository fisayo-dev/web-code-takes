"use client"

import { useEffect, useState } from "react"
import { ProfileView } from "@/components/profile-view"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import { getTakesByUsername } from "@/lib/api"
import { useUser } from "@/hooks/use-user"
import type { Take } from "@/lib/types"

export function MyProfilePage() {
  const { user, isLoading } = useUser()
  const [takes, setTakes] = useState<Take[]>([])
  const [totalTakes, setTotalTakes] = useState(0)
  const [isLoadingTakes, setIsLoadingTakes] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (!user) return

    let cancelled = false
    const username = user.username

    async function loadProfile() {
      setError(undefined)
      setIsLoadingTakes(true)

      try {
        const result = await getTakesByUsername(username)
        if (cancelled) return
        setTakes(result.items)
        setTotalTakes(result.total)
      } catch {
        if (!cancelled) setError("Could not load profile")
      } finally {
        if (!cancelled) setIsLoadingTakes(false)
      }
    }

    void loadProfile()

    return () => {
      cancelled = true
    }
  }, [user])

  if (isLoading || isLoadingTakes) {
    return <ProfileSkeleton isOwnProfile />
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">{error || "Could not load profile"}</p>
      </div>
    )
  }

  return <ProfileView profile={user} takes={takes} totalTakes={totalTakes} isOwnProfile error={error} />
}

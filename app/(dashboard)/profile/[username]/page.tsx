"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams } from "next/navigation"
import { getUserByUsername } from "@/lib/api"
import { avatarUrl } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "@phosphor-icons/react"
import Image from "next/image"
import Link from "next/link"
import type { User } from "@/lib/types"

export default function ProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { user: currentUser } = useUser()
  const [profile, setProfile] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isOwnProfile = currentUser?.username === username

  useEffect(() => {
    if (!username) return

    let cancelled = false
    startTransition(async () => {
      try {
        const user = await getUserByUsername(username)
        if (!cancelled) setProfile(user)
      } catch {
        if (!cancelled) setError("User not found")
      }
    })

    return () => { cancelled = true }
  }, [username, startTransition])

  if (isPending && !profile) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-8 w-48 neo-card-sm" />
        <div className="neo-card bg-card p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <p className="text-sm text-muted-foreground">{error || "User not found"}</p>
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

      <div className="neo-card bg-card p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Image
            src={avatarUrl(profile.username, 120)}
            alt={profile.name}
            width={80}
            height={80}
            className="border-2 border-border"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-lg font-bold uppercase tracking-tight">{profile.name}</h1>
            <p className="text-xs text-muted-foreground">@{profile.username}</p>
            {isOwnProfile && (
              <p className="mt-1 text-[10px] text-primary font-semibold uppercase tracking-widest">
                This is you
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="neo-card bg-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Details</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground text-xs">Username</span>
            <span className="font-semibold text-xs">@{profile.username}</span>
          </div>
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="text-muted-foreground text-xs">Email</span>
            <span className="font-semibold text-xs">{isOwnProfile ? profile.email : "Hidden"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-xs">Joined</span>
            <span className="font-semibold text-xs">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="neo-card bg-card p-6">
        <p className="text-xs text-muted-foreground text-center py-4">
          Takes will appear here soon.
        </p>
      </div>
    </div>
  )
}

"use client"

import { avatarUrl } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, NotepadIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { TakeCard } from "@/components/take-card"
import type { Take, User } from "@/lib/types"

interface ProfileViewProps {
  profile: User | null
  takes: Take[]
  isOwnProfile: boolean
  error?: string
}

export function ProfileView({ profile, takes, isOwnProfile, error }: ProfileViewProps) {
  if (error || !profile) {
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
                <AvatarImage src={avatarUrl(profile.username, 100)} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h1 className="text-lg font-bold uppercase tracking-tight">{profile.name}</h1>
                <p className="text-xs text-muted-foreground">@{profile.username}</p>
                <p className="mt-1 text-[10px] text-primary font-semibold uppercase tracking-widest">
                  This is you
                </p>
              </div>
            </div>
          </div>

          <div className="neo-card bg-card p-6 col-span-9">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Details</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-xs">Username</span>
                <span className="font-semibold text-xs">@{profile.username}</span>
              </div>
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-muted-foreground text-xs">Email</span>
                <span className="font-semibold text-xs">{profile.email}</span>
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
        </div>
      ) : (
        <>
          <div className="neo-card bg-card p-6">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Avatar size="xl">
                <AvatarImage src={avatarUrl(profile.username, 100)} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h1 className="text-lg font-bold uppercase tracking-tight">{profile.name}</h1>
                <p className="text-xs text-muted-foreground">@{profile.username}</p>
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
                <span className="font-semibold text-xs">Hidden</span>
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
        </>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Takes ({takes.length})
        </h2>

        {takes.length === 0 ? (
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
          takes.map((take) => (
            <TakeCard key={take.id} take={take} />
          ))
        )}
      </div>
    </div>
  )
}

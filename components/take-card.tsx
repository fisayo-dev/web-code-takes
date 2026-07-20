"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowUp, ChatCircle } from "@phosphor-icons/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { avatarUrl, relativeTime } from "@/lib/utils"
import { toggleVote } from "@/lib/api"
import type { Take } from "@/lib/types"

interface TakeCardProps {
  take: Take
  onVoteChange?: (takeId: string, hasVoted: boolean, votesCount: number) => void
}

export function TakeCard({ take, onVoteChange }: TakeCardProps) {
  const [optimisticVote, setOptimisticVote] = useState({
    hasVoted: take.hasVoted,
    votesCount: take.votesCount,
  })

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const previousState = { ...optimisticVote }

    setOptimisticVote({
      hasVoted: !optimisticVote.hasVoted,
      votesCount: optimisticVote.hasVoted ? optimisticVote.votesCount - 1 : optimisticVote.votesCount + 1,
    })

    try {
      const result = await toggleVote(take.id)
      setOptimisticVote({
        hasVoted: result.hasVoted,
        votesCount: result.votesCount,
      })
      onVoteChange?.(take.id, result.hasVoted, result.votesCount)
    } catch {
      setOptimisticVote(previousState)
    }
  }

  return (
    <Link href={`/takes/${take.id}`}>
      <div className="neo-card bg-card p-4 transition-all hover:shadow-[5px_5px_0px_oklch(0_0_0_/_20%)] hover:translate-x-[-1px] hover:translate-y-[-1px] cursor-pointer">
        <div className="flex items-center gap-2 mb-3">
          <Avatar>
            <AvatarImage src={avatarUrl(take.author.username, 40)} alt={take.author.name} />
            <AvatarFallback>{take.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xs font-semibold">{take.author.name}</p>
            <p className="text-[10px] text-muted-foreground">
              @{take.author.username} · {relativeTime(take.createdAt)}
            </p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-foreground/90 mb-3">{take.text}</p>

        {take.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {take.hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-[4px] border border-white/15 bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 text-muted-foreground">
          <button
            onClick={handleVote}
            className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              optimisticVote.hasVoted ? "text-primary" : "hover:text-primary"
            }`}
          >
            <ArrowUp className={`size-3.5 ${optimisticVote.hasVoted ? "fill-primary" : ""}`} />
            {optimisticVote.votesCount}
          </button>
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
            <ChatCircle className="size-3.5" />
            {take.commentsCount}
          </span>
        </div>
      </div>
    </Link>
  )
}

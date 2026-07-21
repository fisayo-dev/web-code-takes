"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"
import { updateTake, deleteTake, toggleVote, getComments, createComment, deleteComment } from "@/lib/api"
import { avatarUrl, relativeTime } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CommentSkeleton } from "@/components/skeletons/comment-skeleton"
import { ArrowUp, ChatCircle, ArrowLeft, Pencil, Trash } from "@phosphor-icons/react"
import Link from "next/link"
import type { Take, Comment as TakeComment } from "@/lib/types"
import { COMMENTS_PER_PAGE } from "@/constants"
import { useGsapFadeIn } from "@/hooks/use-gsap"


export function TakeDetailView({ initialTake }: { initialTake: Take }) {
  const router = useRouter()
  const { user } = useUser()

  const backRef = useGsapFadeIn({ selector: "a", y: 12, duration: 0.3 })
  const detailCardRef = useGsapFadeIn({ selector: ".neo-card", y: 24, duration: 0.45, delay: 0.1 })

  const [take, setTake] = useState<Take>(initialTake)
  const [comments, setComments] = useState<TakeComment[]>([])
  const [totalComments, setTotalComments] = useState(0)
  const [commentPage, setCommentPage] = useState(0)
  const [isLoadingComments, setIsLoadingComments] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState("")
  const [editHashtags, setEditHashtags] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const [commentText, setCommentText] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    let cancelled = false
    getComments(take.id, commentPage, COMMENTS_PER_PAGE)
      .then((result) => {
        if (!cancelled) {
          setComments(result.items)
          setTotalComments(result.total)
          setIsLoadingComments(false)
        }
      })
      .catch(() => { if (!cancelled) setIsLoadingComments(false) })
    return () => { cancelled = true }
  }, [take.id, commentPage])

  const handleVote = async () => {
    const previousState = { hasVoted: take.hasVoted, votesCount: take.votesCount }
    setTake({ ...take, hasVoted: !take.hasVoted, votesCount: take.hasVoted ? take.votesCount - 1 : take.votesCount + 1 })

    try {
      const result = await toggleVote(take.id)
      setTake({ ...take, hasVoted: result.hasVoted, votesCount: result.votesCount })
    } catch {
      setTake({ ...take, ...previousState })
    }
  }

  const handleStartEdit = () => {
    setEditText(take.text)
    setEditHashtags([...take.hashtags])
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    setIsSaving(true)
    try {
      const updated = await updateTake(take.id, { text: editText, hashtags: editHashtags })
      setTake({ ...take, ...updated })
      setIsEditing(false)
    } catch {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this take?")) return
    try {
      await deleteTake(take.id)
      router.push("/feed")
    } catch {}
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || isSubmittingComment) return

    setIsSubmittingComment(true)
    try {
      const newComment = await createComment(take.id, commentText.trim())
      setCommentText("")
      setCommentPage(0)
      setTotalComments((prev) => prev + 1)
      setComments((prev) => [newComment, ...prev].slice(0, COMMENTS_PER_PAGE))
    } catch {
      setIsSubmittingComment(false)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return
    try {
      await deleteComment(commentId)
      setComments(comments.filter((c) => c.id !== commentId))
      setTotalComments((prev) => prev - 1)
    } catch {}
  }

  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => { setHasMounted(true) }, [])

  const isOwner = hasMounted && user?.id === take.authorId
  const hasPrevComments = commentPage > 0
  const hasNextComments = (commentPage + 1) * COMMENTS_PER_PAGE < totalComments

  return (
    <div className="flex flex-col gap-6">
      <div ref={backRef}>
        <Link
          href="/feed"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" />
          Back to feed
        </Link>
      </div>

      <div ref={detailCardRef}>
        <div className="neo-card bg-card p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link href={`/profile/${take.author.username}`}>
              <Avatar>
                <AvatarImage src={avatarUrl(take.author.username, 40)} alt={take.author.name} />
                <AvatarFallback>{take.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link href={`/profile/${take.author.username}`} className="text-xs font-semibold hover:text-primary transition-colors">
                {take.author.name}
              </Link>
              <p className="text-[10px] text-muted-foreground">
                @{take.author.username} · {relativeTime(take.createdAt)}
              </p>
            </div>
          </div>

          {isOwner && !isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon-xs" onClick={handleStartEdit}>
                <Pencil className="size-3.5" />
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={handleDelete} className="text-accent-red hover:text-accent-red">
                <Trash className="size-3.5" />
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-3 mb-4">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              maxLength={500}
              className="neo-input min-h-30 resize-none w-full p-3 text-sm"
            />
            <div className="flex flex-wrap gap-1.5">
              {editHashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded border border-white/15 bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground"
                >
                  #{tag}
                  <button
                    onClick={() => setEditHashtags(editHashtags.filter((t) => t !== tag))}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="neo" size="sm" onClick={handleSaveEdit} disabled={isSaving || !editText.trim()}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="neo-secondary" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-foreground/90 mb-3">{take.text}</p>
            {take.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {take.hashtags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded border border-white/15 bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex items-center gap-4 text-muted-foreground border-t border-border pt-3">
          <button
            onClick={handleVote}
            className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              take.hasVoted ? "text-primary" : "hover:text-primary"
            }`}
          >
            <ArrowUp className={`size-3.5 ${take.hasVoted ? "fill-primary" : ""}`} />
            {take.votesCount}
          </button>
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide">
            <ChatCircle className="size-3.5" />
            {totalComments}
          </span>
        </div>
      </div>
      </div>

      <div className="neo-card bg-card p-6 rounded-xl">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Comments ({totalComments})
        </h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="flex gap-2 mb-6">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              maxLength={500}
              className="flex-1"
            />
            <Button type="submit" variant="neo" size="sm" disabled={!commentText.trim() || isSubmittingComment}>
              {isSubmittingComment ? "..." : "Post"}
            </Button>
          </form>
        ) : (
          <p className="text-xs text-muted-foreground mb-6">
            <Link href="/login" className="text-primary hover:underline">Log in</Link> to comment.
          </p>
        )}

        {isLoadingComments ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CommentSkeleton key={i} />
            ))}
          </div>
        ) : user && comments.length === 0 && commentPage === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/profile/${comment.author.username}`}>
                      <Avatar>
                        <AvatarImage src={avatarUrl(comment.author.username, 32)} alt={comment.author.name} />
                        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link href={`/profile/${comment.author.username}`} className="text-xs font-semibold hover:text-primary transition-colors">
                        {comment.author.name}
                      </Link>
                      <p className="text-[10px] text-muted-foreground">
                        @{comment.author.username} · {relativeTime(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  {user?.id === comment.authorId && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-accent-red hover:text-accent-red"
                    >
                      <Trash className="size-3" />
                    </Button>
                  )}
                </div>
                <p className="text-xs leading-relaxed text-foreground/90">{comment.text}</p>
              </div>
            ))}

            {(hasPrevComments || hasNextComments) && (
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="neo-secondary"
                  size="sm"
                  onClick={() => setCommentPage((p) => p - 1)}
                  disabled={!hasPrevComments}
                >
                  Previous
                </Button>
                <Button
                  variant="neo-secondary"
                  size="sm"
                  onClick={() => setCommentPage((p) => p + 1)}
                  disabled={!hasNextComments}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

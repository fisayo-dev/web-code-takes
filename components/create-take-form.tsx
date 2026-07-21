"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createTake } from "@/lib/api"
import { X } from "@phosphor-icons/react"

export function CreateTakeForm() {
  const router = useRouter()
  const [text, setText] = useState("")
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddHashtag = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase()
    if (cleaned && !hashtags.includes(cleaned) && hashtags.length < 10) {
      setHashtags([...hashtags, cleaned])
    }
    setHashtagInput("")
  }

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && hashtagInput.trim()) {
      e.preventDefault()
      handleAddHashtag(hashtagInput.trim())
    }
  }

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    try {
      await createTake({ text: text.trim(), hashtags })
      router.push("/feed")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create take"
      setError(message)
      setIsSubmitting(false)
    }
  }

  const remainingChars = 500 - text.length

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Your Take
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's your coding hot take?"
          maxLength={500}
          rows={6}
          className="neo-input min-h-[160px] resize-none w-full p-4 text-sm"
        />
        <div className="flex justify-end">
          <span className={`text-[10px] font-semibold ${remainingChars < 50 ? "text-accent-red" : "text-muted-foreground"}`}>
            {remainingChars} characters remaining
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Hashtags
        </label>
        <div className="flex gap-2">
          <input
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            onKeyDown={handleHashtagKeyDown}
            onBlur={() => hashtagInput.trim() && handleAddHashtag(hashtagInput.trim())}
            placeholder="Type a hashtag and press Enter"
            maxLength={30}
            disabled={hashtags.length >= 10}
            className="neo-input flex-1 p-2 text-sm"
          />
        </div>
        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded border border-white/15 bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveHashtag(tag)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="text-[10px] text-muted-foreground">
          {hashtags.length}/10 hashtags
        </p>
      </div>

      {error && (
        <div className="neo-card-sm border-l-4 border-l-accent-red bg-card p-3">
          <p className="text-xs text-accent-red">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="neo" disabled={!text.trim() || isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Take"}
        </Button>
        <Button type="button" variant="neo-secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

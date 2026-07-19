"use client"

import { useState } from "react"
import { TrendUp, Fire, ChatCircle, ArrowUp } from "@phosphor-icons/react"

interface Take {
  id: string
  author: string
  handle: string
  content: string
  likes: number
  comments: number
}

const trendingTakes: Take[] = [
  {
    id: "1",
    author: "Sarah Chen",
    handle: "@sarahc",
    content: "Tabs are objectively better than spaces. Fight me. The indentation width is semantic, not syntactic.",
    likes: 342,
    comments: 89,
  },
  {
    id: "2",
    author: "Marcus Dev",
    handle: "@marcusd",
    content: "If your codebase needs a README longer than 2 pages, your architecture is the problem. Good code is self-documenting.",
    likes: 278,
    comments: 156,
  },
  {
    id: "3",
    author: "Aiko Tanaka",
    handle: "@aikot",
    content: "TypeScript is just JavaScript with extra steps. The type system gives you a false sense of security while slowing you down.",
    likes: 198,
    comments: 234,
  },
  {
    id: "4",
    author: "Jake Rivers",
    handle: "@jaker",
    content: "Microservices are over-engineered for 99% of projects. A well-structured monolith will always beat a poorly designed distributed system.",
    likes: 456,
    comments: 67,
  },
]

const popularTakes: Take[] = [
  {
    id: "5",
    author: "Priya Sharma",
    handle: "@priyas",
    content: "CSS is the most underrated language. People who hate it just never learned it properly. It's incredibly powerful.",
    likes: 523,
    comments: 112,
  },
  {
    id: "6",
    author: "Leo Martinez",
    handle: "@leom",
    content: "AI won't replace developers. It will replace developers who can't adapt. The bar just got higher, not eliminated.",
    likes: 489,
    comments: 201,
  },
  {
    id: "7",
    author: "Emma Wilson",
    handle: "@emmaw",
    content: "Stop using useEffect for everything. 90% of useEffect calls are a sign you're fighting React instead of working with it.",
    likes: 612,
    comments: 88,
  },
  {
    id: "8",
    author: "David Park",
    handle: "@davidp",
    content: "10x developers don't write 10x more code. They write 10x less code that solves the same problem. Simplicity is the ultimate sophistication.",
    likes: 387,
    comments: 145,
  },
]

function TakeCard({ take }: { take: Take }) {
  return (
    <div className="group border border-border bg-card p-4 shadow-[3px_3px_0px_oklch(0_0_0_/_15%)] transition-all hover:shadow-[4px_4px_0px_oklch(0_0_0_/_20%)] hover:translate-x-[-1px] hover:translate-y-[-1px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex size-8 items-center justify-center bg-primary/10 text-primary text-xs font-bold uppercase">
          {take.author.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-semibold">{take.author}</p>
          <p className="text-[10px] text-muted-foreground">{take.handle}</p>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 mb-3">{take.content}</p>
      <div className="flex items-center gap-4 text-muted-foreground">
        <button className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide hover:text-primary transition-colors">
          <ArrowUp className="size-3.5" />
          {take.likes}
        </button>
        <button className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide hover:text-primary transition-colors">
          <ChatCircle className="size-3.5" />
          {take.comments}
        </button>
      </div>
    </div>
  )
}

export function TrendingTakes() {
  const [activeTab, setActiveTab] = useState<"trending" | "popular">("trending")
  const takes = activeTab === "trending" ? trendingTakes : popularTakes

  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-4 mb-10">
          <h2 className="text-2xl font-bold uppercase tracking-tight md:text-3xl">
            What developers are saying
          </h2>
          <p className="text-sm text-muted-foreground max-w-md text-center">
            Discover the hottest opinions from the community. Agree or disagree
            &mdash; your voice matters.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === "trending"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <TrendUp className="size-3.5" />
            Trending
          </button>
          <button
            onClick={() => setActiveTab("popular")}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
              activeTab === "popular"
                ? "bg-primary text-primary-foreground"
                : "border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <Fire className="size-3.5" />
            Popular
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {takes.map((take) => (
            <TakeCard key={take.id} take={take} />
          ))}
        </div>
      </div>
    </section>
  )
}

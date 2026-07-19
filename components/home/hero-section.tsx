"use client"

import Link from "next/link"
import { Code, ArrowRight } from "@phosphor-icons/react"

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-6 max-w-2xl">
        <div className="flex items-center gap-2 rounded-none border border-border bg-card px-4 py-2 shadow-[3px_3px_0px_oklch(0_0_0_/_20%)]">
          <Code className="size-4 text-primary" weight="bold" />
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">code-takes</span>
        </div>

        <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Share your{" "}
          <span className="text-primary">hot takes</span>
          <br />
          on code
        </h1>

        <p className="max-w-md text-sm text-muted-foreground md:text-base">
          The developer community where opinions matter. Drop your most controversial
          coding opinions, debate with others, and discover what the community really
          thinks.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="neo-btn-green inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
          >
            Get Started
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/feed"
            className="neo-btn inline-flex items-center justify-center gap-2 bg-secondary px-6 py-3 text-sm"
          >
            Explore Takes
          </Link>
        </div>

        <div className="mt-8 flex items-center gap-8 text-xs text-muted-foreground">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">2.4k+</span>
            <span>Developers</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">12k+</span>
            <span>Takes</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-foreground">48k+</span>
            <span>Reactions</span>
          </div>
        </div>
      </div>
    </section>
  )
}

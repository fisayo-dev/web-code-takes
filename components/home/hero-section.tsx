"use client"

import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react"
import { useGsapFadeIn, useGsapPop } from "@/hooks/use-gsap"

export function HeroSection() {
  const headingRef = useGsapFadeIn({ selector: "h1", y: 30, duration: 0.6, ease: "back.out(1.7)" })
  const subtitleRef = useGsapFadeIn({ selector: "p", y: 20, duration: 0.5, delay: 0.15 })
  const buttonsRef = useGsapPop({ selector: ":scope > *", scale: 0.8, duration: 0.4, stagger: 0.1, delay: 0.3 })
  const statsRef = useGsapFadeIn({ selector: ":scope > *", y: 16, duration: 0.4, stagger: 0.08, delay: 0.45 })

  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-20 text-center md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-6 max-w-4xl">
        <div ref={headingRef}>
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Share your{" "}
            <span className="text-primary">hot takes</span>
            <br />
            on code
          </h1>
        </div>

        <div ref={subtitleRef}>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            The developer community where opinions matter. Drop your most controversial
            coding opinions, debate with others, and discover what the community really
            thinks.
          </p>
        </div>

        <div ref={buttonsRef} className="flex flex-col gap-3 sm:flex-row">
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

        <div ref={statsRef} className="mt-8 flex items-center gap-8 text-xs text-muted-foreground">
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

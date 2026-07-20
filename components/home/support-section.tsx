"use client"
import { Heart, Coffee } from "@phosphor-icons/react"

export function SupportSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="border border-border bg-card p-8 md:p-12 shadow-[4px_4px_0px_oklch(0_0_0_/_15%)]">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center bg-primary/10">
            <Heart className="size-6 text-primary" weight="fill" />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight md:text-2xl">
            Support code-takes
          </h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Code-takes is a passion project built by developers, for developers.
            We run on coffee and community love. If you enjoy the platform,
            consider supporting us to keep the servers running and the takes
            flowing.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#"
              className="neo-btn-green inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              <Coffee className="size-4" />
              Buy us a coffee
            </a>
            <a
              href="#"
              className="neo-btn inline-flex items-center gap-2 bg-secondary px-6 py-3 text-sm"
            >
              Sponsor on GitHub
            </a>
          </div>
          <p className="mt-6 text-[10px] text-muted-foreground uppercase tracking-widest">
            Every contribution helps us build a better community
          </p>
        </div>
      </div>
    </section>
  )
}

"use client"
import { Code, GithubLogo, TwitterLogo } from "@phosphor-icons/react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Code className="size-5 text-primary" weight="bold" />
              <span className="text-sm font-bold uppercase tracking-tight">code-takes</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              Where developers share coding takes
            </p>
          </div>

          <div className="flex gap-12 text-xs">
            <div className="flex flex-col gap-2">
              <span className="font-semibold uppercase tracking-widest text-muted-foreground text-[10px]">Product</span>
              <Link href="/feed" className="text-muted-foreground hover:text-foreground transition-colors">Feed</Link>
              <Link href="/signup" className="text-muted-foreground hover:text-foreground transition-colors">Sign Up</Link>
              <Link href="/login" className="text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-semibold uppercase tracking-widest text-muted-foreground text-[10px]">Community</span>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guidelines</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <GithubLogo className="size-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <TwitterLogo className="size-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            &copy; {new Date().getFullYear()} code-takes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

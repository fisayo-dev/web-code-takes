import Link from "next/link"
import { Code } from "@phosphor-icons/react"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background shadow-[0_2px_10px_oklch(0_0_0_/_25%)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className="size-5 text-primary" weight="bold" />
          <span className="text-sm font-bold uppercase tracking-tight">code-takes</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  )
}

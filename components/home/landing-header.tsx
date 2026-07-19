"use client"

import Link from "next/link"
import Image from "next/image"
import { Code } from "@phosphor-icons/react"
import { useUser } from "@/hooks/use-user"
import { avatarUrl } from "@/lib/utils"

export function LandingHeader() {
  const { user, isAuthenticated } = useUser()

  return (
    <header className="sticky top-0 z-50 bg-background shadow-[0_2px_10px_oklch(0_0_0_/_25%)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className="size-5 text-primary" weight="bold" />
          <span className="text-sm font-bold uppercase tracking-tight">code-takes</span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link href="/feed" className="flex items-center gap-2">
              <Image
                src={avatarUrl(user.username)}
                alt={user.name}
                width={32}
                height={32}
                className="border border-border hover:opacity-80 transition-opacity"
              />
            </Link>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

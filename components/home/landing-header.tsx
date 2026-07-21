"use client"

import Link from "next/link"
import { Code } from "@phosphor-icons/react"
import { useUser } from "@/hooks/use-user"
import { avatarUrl } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function LandingHeader() {
  const { user, isAuthenticated } = useUser()

  return (
    <header className="sticky top-0 z-50 bg-background  border-b border-foreground/10">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between ">
        <Link href="/" className="flex items-center gap-2">
          <Code className="size-5 text-primary" weight="bold" />
          <span className="text-sm font-bold uppercase tracking-tight">code-takes</span>
        </Link>

        <nav className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link href="/feed" className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={avatarUrl(user.username)} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
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
                className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity rounded-lg"
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

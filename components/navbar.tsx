"use client"

import Link from "next/link"
import { useUser } from "@/hooks/use-user"
import { avatarUrl } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Code, SignOut, User as UserIcon } from "@phosphor-icons/react"
import Image from "next/image"

export function Navbar() {
  const { user, isAuthenticated, reset } = useUser()

  const handleLogout = async () => {
    try {
      const { logout } = await import("@/lib/api")
      await logout()
    } finally {
      reset()
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background shadow-[0_2px_10px_oklch(0_0_0_/_25%)]">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className="size-5 text-primary" weight="bold" />
          <span className="text-sm font-bold uppercase tracking-tight">code-takes</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/feed" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            Feed
          </Link>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <Image
                  src={avatarUrl(user.username)}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="border border-border hover:opacity-80 transition-opacity"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48 rounded-none border border-border bg-card p-1 shadow-[4px_4px_0px_oklch(0_0_0_/_20%)]">
                <div className="flex items-center gap-3 px-2 py-2">
                  <Image
                    src={avatarUrl(user.username)}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="border border-border"
                  />
                  <div>
                    <p className="text-xs font-semibold">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">@{user.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="my-1 h-px bg-border" />
                <DropdownMenuItem className="rounded-none outline-none">
                  <Link href={`/profile/${user.username}`} className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold w-full hover:text-primary transition-colors">
                    <UserIcon className="size-3.5" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-none outline-none">
                  <Link href="/settings" className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold w-full hover:text-primary transition-colors">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 h-px bg-border" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center gap-2 rounded-none px-2 py-1.5 text-xs text-accent-red hover:bg-muted outline-none"
                >
                  <SignOut className="size-3.5" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="inline-flex items-center rounded-none border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

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
import { Code, GearIcon, SignOut, User as UserIcon } from "@phosphor-icons/react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PlusIcon } from "@phosphor-icons/react/dist/ssr"
import { Button } from "./ui/button"
import { useGsapSlideDown } from "@/hooks/use-gsap"

export function Navbar() {
  const { user, isAuthenticated, reset } = useUser()
  const navRef = useGsapSlideDown({ selector: ":scope > *", y: -16, duration: 0.35, stagger: 0.05 })

  const handleLogout = async () => {
    try {
      const { logout } = await import("@/lib/api")
      await logout()
    } finally {
      reset()
      window.location.href = "/"
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-foreground/10 ">
      <div ref={navRef} className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Code className="size-5 text-primary" weight="bold" />
          <span className="text-sm font-bold uppercase tracking-tight">code-takes</span>
        </Link>

        <nav className="flex items-center gap-4">

          {isAuthenticated && user ? (
            <>
              <Link href="/create">
                <Button variant="outline" className="text-xs flex items-center gap-2">
                  <PlusIcon className="size-3.5" />
                  Create take
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none cursor-pointer">
                  <Avatar>
                    <AvatarImage src={avatarUrl(user.username)} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-48 rounded border border-border bg-card p-1 shadow-[4px_4px_0px_oklch(0_0_0_/_20%)]">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar size="lg">
                      <AvatarImage src={avatarUrl(user.username)} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-1 h-px bg-border" />
                  <DropdownMenuItem className="rounded outline-none">
                    <Link href="/profile/me" className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold w-full hover:text-primary transition-colors">
                      <UserIcon className="size-3.5" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 h-px bg-border" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex cursor-pointer items-center gap-2 rounded px-4 py-3 text-xs text-accent-red hover:bg-muted outline-none"
                  >
                    <SignOut className="size-3.5" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>

          ) : (
            <Link href="/login" className="inline-flex items-center rounded border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors">
              Log In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

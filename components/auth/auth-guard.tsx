"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useUser } from "@/hooks/use-user"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading || isAuthenticated) return
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
  }, [isLoading, isAuthenticated, router, pathname])

  if (isLoading) return null
  if (!isAuthenticated) return null

  return <>{children}</>
}

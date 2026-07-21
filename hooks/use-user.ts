"use client"

import { useEffect, useState } from "react"
import { getMe } from "@/lib/api"
import type { User } from "@/lib/types"

let cachedUser: User | null = null
let fetchPromise: Promise<User | null> | null = null

function fetchUserOnce(): Promise<User | null> {
  if (fetchPromise) return fetchPromise
  fetchPromise = getMe()
    .then((user) => {
      cachedUser = user
      return user
    })
    .catch(() => {
      cachedUser = null
      return null
    })
  return fetchPromise
}

export function useUser() {
  const [user, setUser] = useState<User | null>(cachedUser)
  const [isLoading, setIsLoading] = useState(!cachedUser)

  useEffect(() => {
    if (cachedUser) return

    let cancelled = false
    fetchUserOnce().then((u) => {
      if (!cancelled) {
        setUser(u)
        setIsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  function reset() {
    cachedUser = null
    fetchPromise = null
    setUser(null)
    setIsLoading(false)
  }

  function updateCachedUser(updater: (prev: User) => User) {
    if (cachedUser) {
      cachedUser = updater(cachedUser)
      setUser(cachedUser)
    }
  }

  return { user, isLoading, isAuthenticated: !!user, reset, updateCachedUser }
}

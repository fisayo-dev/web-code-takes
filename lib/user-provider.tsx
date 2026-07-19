"use client"

import { createContext, useCallback, useEffect, useRef, useState } from "react"
import { getMe, logout as apiLogout } from "@/lib/api"
import type { User } from "@/lib/types"

interface UserContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  refetch: () => Promise<void>
  logout: () => Promise<void>
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refetch: async () => {},
  logout: async () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    async function loadUser() {
      try {
        const data = await getMe()
        if (mountedRef.current) setUser(data)
      } catch {
        if (mountedRef.current) setUser(null)
      } finally {
        if (mountedRef.current) setIsLoading(false)
      }
    }

    void loadUser()

    return () => {
      mountedRef.current = false
    }
  }, [])

  const refetch = useCallback(async () => {
    try {
      const data = await getMe()
      if (mountedRef.current) setUser(data)
    } catch {
      if (mountedRef.current) setUser(null)
    } finally {
      if (mountedRef.current) setIsLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
      window.location.href = "/login"
    }
  }, [])

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        refetch,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

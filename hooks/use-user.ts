"use client"

import { useContext } from "react"
import { UserContext } from "@/lib/user-provider"

export function useUser() {
  return useContext(UserContext)
}

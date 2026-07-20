import { cookies } from "next/headers"
import type { ApiResponse, Take, User } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

async function serverFetch<T>(path: string): Promise<T> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  console.log("[serverFetch]", path, "token present:", !!token)

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { headers })
  console.log("[serverFetch]", path, "status:", res.status)

  if (!res.ok) {
    const body = await res.text()
    console.log("[serverFetch]", path, "error body:", body)
    throw new Error(`API error ${res.status}: ${body}`)
  }

  const json: ApiResponse<T> = await res.json()

  if (!json.success) {
    throw new Error(json.message)
  }
  return json.data as T
}

export async function getServerUser(): Promise<User> {
  return serverFetch<User>("/users/me")
}

export async function getServerUserByUsername(username: string): Promise<User> {
  return serverFetch<User>(`/users/${username}`)
}

export async function getServerTakesByUsername(username: string): Promise<Take[]> {
  return serverFetch<Take[]>(`/takes/user/${username}`)
}

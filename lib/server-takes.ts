import type { Take } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function fetchServerTakesByUsername(username: string): Promise<Take[]> {
  const res = await fetch(`${API_URL}/takes/user/${username}`, {
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) return []

  const json = await res.json()
  if (!json.success) return []
  return json.data || []
}

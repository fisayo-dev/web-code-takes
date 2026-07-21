import type { PaginatedData, Take } from "./types"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export async function fetchServerTakeById(id: string): Promise<Take | null> {
  const res = await fetch(`${API_URL}/takes/${id}`, {
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) return null

  const json = await res.json()
  if (!json.success) return null
  return json.data || null
}

export async function fetchServerTakesByUsername(
  username: string,
  limit: number = 10,
  offset: number = 0
): Promise<PaginatedData<Take>> {
  const res = await fetch(`${API_URL}/takes/user/${username}?limit=${limit}&offset=${offset}`, {
    headers: { "Content-Type": "application/json" },
  })

  if (!res.ok) return { items: [], total: 0 }

  const json = await res.json()
  if (!json.success) return { items: [], total: 0 }
  return json.data || { items: [], total: 0 }
}

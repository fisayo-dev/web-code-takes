import type { PaginatedData, Take } from "./types"
import { getServerAuthToken } from "./server-auth"

const API_URL = process.env.NEXT_PUBLIC_API_URL!

async function serverTakesFetch<T>(path: string): Promise<T> {
  const token = await getServerAuthToken()

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, { headers })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }

  const json = await res.json()
  if (!json.success) throw new Error(json.message)
  return json.data as T
}

export async function fetchServerTakeById(id: string): Promise<Take | null> {
  try {
    return await serverTakesFetch<Take>(`/takes/${id}`)
  } catch {
    return null
  }
}

export async function fetchServerTakesByUsername(
  username: string,
  limit: number = 10,
  offset: number = 0
): Promise<PaginatedData<Take>> {
  try {
    return await serverTakesFetch<PaginatedData<Take>>(
      `/takes/user/${username}?limit=${limit}&offset=${offset}`
    )
  } catch {
    return { items: [], total: 0 }
  }
}

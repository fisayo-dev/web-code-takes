import { cookies } from "next/headers"

export async function getServerAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get("auth_token")?.value ?? cookieStore.get("session")?.value ?? null
}

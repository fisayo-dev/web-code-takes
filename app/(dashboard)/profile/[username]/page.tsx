import { redirect } from "next/navigation"
import { getServerUser, getServerUserByUsername } from "@/lib/server-api"
import { ProfileView } from "@/components/profile-view"
import { fetchServerTakesByUsername } from "@/lib/server-takes"
import type { Take } from "@/lib/types"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  let currentUser = null
  try {
    currentUser = await getServerUser()
  } catch {}

  if (currentUser?.username === username) {
    redirect("/profile/me")
  }

  let profile = null
  let takes: Take[] = []
  let totalTakes = 0
  let error: string | undefined

  try {
    profile = await getServerUserByUsername(username)
    if (profile) {
      const result = await fetchServerTakesByUsername(username)
      takes = result.items
      totalTakes = result.total
    }
  } catch {
    error = "User not found"
  }

  return <ProfileView profile={profile} takes={takes} totalTakes={totalTakes} isOwnProfile={false} error={error} />
}

import { redirect } from "next/navigation"
import { getServerUser, getServerUserByUsername } from "@/lib/server-api"
import { ProfileView } from "@/components/profile-view"
import { fetchServerTakesByUsername } from "@/lib/server-takes"
import type { Take } from "@/lib/types"

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  let currentUser = null
  try {
    currentUser = await getServerUser()
  } catch {
    // not logged in
  }

  if (currentUser?.username === username) {
    redirect("/profile/me")
  }

  let profile = null
  let takes: Take[] = []
  let error: string | undefined

  try {
    profile = await getServerUserByUsername(username)
    if (profile) {
      takes = await fetchServerTakesByUsername(username)
    }
  } catch {
    error = "User not found"
  }

  return <ProfileView profile={profile} takes={takes} isOwnProfile={false} error={error} />
}

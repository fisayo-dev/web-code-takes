import { redirect } from "next/navigation"
import { getServerUser, getServerUserByUsername } from "@/lib/server-api"
import { ProfileView } from "@/components/profile-view"

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
    // not logged in — just show the profile
  }

  if (currentUser?.username === username) {
    redirect("/profile/me")
  }

  let profile = null
  let error: string | undefined

  try {
    profile = await getServerUserByUsername(username)
  } catch {
    error = "User not found"
  }

  return <ProfileView profile={profile} isOwnProfile={false} error={error} />
}

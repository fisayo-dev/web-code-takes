import { getServerUser } from "@/lib/server-api"
import { ProfileView } from "@/components/profile-view"

export default async function MyProfilePage() {
  let profile = null
  let error: string | undefined

  try {
    profile = await getServerUser()
  } catch (e) {
    console.error("[/profile/me] fetch failed:", e)
    error = "Could not load profile"
  }

  return <ProfileView profile={profile} isOwnProfile error={error} />
}

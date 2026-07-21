import { getServerUser } from "@/lib/server-api"
import { ProfileView } from "@/components/profile-view"
import { fetchServerTakesByUsername } from "@/lib/server-takes"
import type { Take } from "@/lib/types"

export default async function MyProfilePage() {
  let profile = null
  let takes: Take[] = []
  let totalTakes = 0
  let error: string | undefined

  try {
    profile = await getServerUser()
    if (profile) {
      const result = await fetchServerTakesByUsername(profile.username)
      takes = result.items
      totalTakes = result.total
    }
  } catch (e) {
    console.error("[/profile/me] fetch failed:", e)
    error = "Could not load profile"
  }

  return <ProfileView profile={profile} takes={takes} totalTakes={totalTakes} isOwnProfile error={error} />
}

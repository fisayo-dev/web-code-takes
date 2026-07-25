import { redirect } from "next/navigation"
import { LandingHeader } from "@/components/home/landing-header"
import { HeroSection } from "@/components/home/hero-section"
import { TrendingTakes } from "@/components/home/trending-takes"
import { SupportSection } from "@/components/home/support-section"
import { Footer } from "@/components/footer"
import { getServerAuthToken } from "@/lib/server-auth"

export default async function RootPage() {
  const hasSession = !!(await getServerAuthToken())

  if (hasSession) {
    redirect("/feed")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <TrendingTakes />
        <SupportSection />
      </main>
      <Footer />
    </div>
  )
}

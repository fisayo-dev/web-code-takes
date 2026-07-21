import { SITE_URL } from "@/constants"
import { fetchServerTakeById } from "@/lib/server-takes"
import { Metadata } from "next"
import type { PageProps } from "@/types"


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const take = await fetchServerTakeById(id)

  if (!take) {
    return { title: "Take not found | code-takes" }
  }

  const title = `${take.author.name} on code-takes`
  const description = take.text.length > 160 ? take.text.slice(0, 157) + "..." : take.text
  const url = `${SITE_URL}/takes/${take.id}`
  const hashtags = take.hashtags.length > 0 ? take.hashtags.map((t) => `#${t}`).join(" ") : ""

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "code-takes",
      type: "article",
      authors: [take.author.name],
      publishedTime: take.createdAt,
      ...(hashtags && { keywords: take.hashtags }),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  }
}


const TakeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default TakeLayout
import { cn } from "@/lib/utils"
import { Code } from "@phosphor-icons/react"
import Link from "next/link"
import { useGsapPop } from "@/hooks/use-gsap"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
}

export function AuthCard({ children, className }: AuthCardProps) {
  const cardRef = useGsapPop({ selector: ".neo-card", scale: 0.92, duration: 0.45, ease: "back.out(1.8)" })

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div ref={cardRef} className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link href="/" className=" flex items-center gap-2 px-4 py-2">
            <Code className="size-5" weight="bold" />
            <span className="text-lg font-bold tracking-tight uppercase">
              code-takes
            </span>
          </Link>
        </div>

        <div className={cn("neo-card bg-card p-8 rounded-xl", className)}>
          {children}
        </div>
      </div>
    </div>
  )
}

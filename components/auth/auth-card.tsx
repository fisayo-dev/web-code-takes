import { cn } from "@/lib/utils"
import { Code } from "@phosphor-icons/react"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="neo-card-sm flex items-center gap-2 px-4 py-2">
            <Code className="size-5" weight="bold" />
            <span className="text-lg font-bold tracking-tight uppercase">
              code-takes
            </span>
          </div>
        </div>

        <div className={cn("neo-card bg-card p-8", className)}>
          {children}
        </div>
      </div>
    </div>
  )
}

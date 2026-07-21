import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded border-2 border-white/15 bg-[oklch(0.20_0.02_260)] px-3 py-2 text-sm text-[oklch(0.97_0_0)] transition-shadow outline-none placeholder:text-[oklch(0.62_0_0)] focus:outline-2 focus:outline-[var(--accent-green)] focus:outline-offset-0 focus:shadow-[2px_2px_0px_oklch(0_0_0_/_20%)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-accent-red aria-invalid:outline-2 aria-invalid:outline-accent-red/30 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Input }

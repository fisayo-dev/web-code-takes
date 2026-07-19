"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
}: OtpInputProps) {
  const [focused, setFocused] = useState<number | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const digits = value.split("").concat(Array(length - value.length).fill(""))

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputRefs.current[index]?.focus()
        inputRefs.current[index]?.select()
      }
    },
    [length],
  )

  useEffect(() => {
    if (focused !== null) {
      focusInput(focused)
    }
  }, [focused, focusInput])

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return

    const newValue = digits.slice()
    newValue[index] = digit.slice(-1)
    const joined = newValue.join("")
    onChange(joined)

    if (digit && index < length - 1) {
      setFocused(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      const newValue = digits.slice()
      if (newValue[index]) {
        newValue[index] = ""
        onChange(newValue.join(""))
      } else if (index > 0) {
        newValue[index - 1] = ""
        onChange(newValue.join(""))
        setFocused(index - 1)
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      setFocused(index - 1)
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault()
      setFocused(index + 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    if (pasted) {
      onChange(pasted)
      setFocused(Math.min(pasted.length, length - 1))
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ""}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={() => setFocused(i)}
          onPaste={i === 0 ? handlePaste : undefined}
          className={cn(
            "neo-input h-12 w-10 text-center text-lg font-semibold",
            "focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-1",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  )
}

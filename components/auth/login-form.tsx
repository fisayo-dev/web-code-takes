"use client"

import { useState } from "react"
import Link from "next/link"
import { login } from "@/lib/api"
import { AlertModal } from "@/components/alert-modal"
import { AuthCard } from "@/components/auth/auth-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    open: boolean
    type: "success" | "error"
    title: string
    description?: string
  }>({ open: false, type: "success", title: "" })

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!EMAIL_REGEX.test(email)) {
      newErrors.email = "Enter a valid email"
    }
    if (!password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await login({ email, password })
      setAlert({
        open: true,
        type: "success",
        title: "Welcome back!",
        description: "Redirecting you now...",
      })
      setTimeout(() => {
        window.location.href = "/feed"
      }, 1500)
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        title: "Login failed",
        description: err instanceof Error ? err.message : "Invalid credentials",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field: "email" | "password") =>
    cn("w-full", errors[field] && "border-accent-red focus:outline-accent-red/30")

  return (
    <AuthCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="space-y-1">
          <h1 className="text-lg font-bold uppercase tracking-tight">Log In</h1>
          <p className="text-xs text-muted-foreground">Welcome back to code-takes</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="font-semibold uppercase text-[10px] tracking-wider">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ada@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setErrors((prev) => ({ ...prev, email: undefined }))
            }}
            className={inputClass("email")}
          />
          {errors.email && <p className="text-[10px] text-accent-red">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="font-semibold uppercase text-[10px] tracking-wider">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setErrors((prev) => ({ ...prev, password: undefined }))
            }}
            className={inputClass("password")}
          />
          {errors.password && <p className="text-[10px] text-accent-red">{errors.password}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <div className="mt-6">
        <Separator className="my-4" />
        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-foreground underline underline-offset-2 hover:no-underline">
            Sign up
          </Link>
        </p>
      </div>

      <AlertModal
        open={alert.open}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        type={alert.type}
        title={alert.title}
        description={alert.description}
      />
    </AuthCard>
  )
}

"use client"

import { useCallback, useEffect, useState } from "react"
import { checkUsername } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface Step1Data {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface Step1Errors {
  firstName?: string
  lastName?: string
  username?: string
  email?: string
  password?: string
  confirmPassword?: string
}

interface SignupStep1Props {
  data: Step1Data
  onChange: (data: Step1Data) => void
  onNext: () => void
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function SignupStep1({ data, onChange, onNext }: SignupStep1Props) {
  const [errors, setErrors] = useState<Step1Errors>({})
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")

  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus("idle")
      return
    }
    setUsernameStatus("checking")
    try {
      await checkUsername(username)
      setUsernameStatus("available")
    } catch {
      setUsernameStatus("taken")
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.username) checkUsernameAvailability(data.username)
    }, 500)
    return () => clearTimeout(timer)
  }, [data.username, checkUsernameAvailability])

  const update = (field: keyof Step1Data, value: string) => {
    onChange({ ...data, [field]: value })
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const newErrors: Step1Errors = {}

    if (!data.firstName.trim()) newErrors.firstName = "First name is required"
    if (!data.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!data.username.trim()) {
      newErrors.username = "Username is required"
    } else if (usernameStatus === "taken") {
      newErrors.username = "Username is already taken"
    } else if (usernameStatus === "checking") {
      newErrors.username = "Checking availability..."
    }
    if (!data.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!EMAIL_REGEX.test(data.email)) {
      newErrors.email = "Enter a valid email"
    }
    if (!data.password) {
      newErrors.password = "Password is required"
    } else if (data.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    if (!data.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onNext()
  }

  const inputClass = (field: keyof Step1Errors) =>
    cn("neo-input w-full", errors[field] && "border-accent-red focus:ring-accent-red/30")

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-1">
        <h1 className="text-lg font-bold uppercase tracking-tight">Create Account</h1>
        <p className="text-xs text-muted-foreground">Step 1 of 2 — Fill in your details</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="firstName" className="font-semibold uppercase text-[10px] tracking-wider">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="Ada"
            value={data.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            className={inputClass("firstName")}
          />
          {errors.firstName && <p className="text-[10px] text-accent-red">{errors.firstName}</p>}
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="lastName" className="font-semibold uppercase text-[10px] tracking-wider">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Lovelace"
            value={data.lastName}
            onChange={(e) => update("lastName", e.target.value)}
            className={inputClass("lastName")}
          />
          {errors.lastName && <p className="text-[10px] text-accent-red">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="username" className="font-semibold uppercase text-[10px] tracking-wider">
          Username
        </Label>
        <Input
          id="username"
          placeholder="adalovelace"
          value={data.username}
          onChange={(e) => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
          className={inputClass("username")}
        />
        {data.username && usernameStatus === "available" && (
          <p className="text-[10px] text-accent-green">Username is available</p>
        )}
        {data.username && usernameStatus === "taken" && (
          <p className="text-[10px] text-accent-red">Username is already taken</p>
        )}
        {errors.username && <p className="text-[10px] text-accent-red">{errors.username}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="font-semibold uppercase text-[10px] tracking-wider">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="ada@example.com"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          className={inputClass("email")}
        />
        {errors.email && <p className="text-[10px] text-accent-red">{errors.email}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="password" className="font-semibold uppercase text-[10px] tracking-wider">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Min 6 characters"
            value={data.password}
            onChange={(e) => update("password", e.target.value)}
            className={inputClass("password")}
          />
          {errors.password && <p className="text-[10px] text-accent-red">{errors.password}</p>}
        </div>
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="confirmPassword" className="font-semibold uppercase text-[10px] tracking-wider">
            Confirm
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Repeat password"
            value={data.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            className={inputClass("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-[10px] text-accent-red">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <button type="submit" className="neo-btn mt-2 w-full bg-primary py-2.5 text-xs text-primary-foreground">
        Continue
      </button>
    </form>
  )
}

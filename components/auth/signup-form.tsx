"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { login, sendOtp, signup, verifyOtp } from "@/lib/api"
import { AlertModal } from "@/components/alert-modal"
import { AuthCard } from "@/components/auth/auth-card"
import { SignupStep1, type Step1Data } from "@/components/auth/signup-step-1"
import { SignupStep2 } from "@/components/auth/signup-step-2"
import { Separator } from "@/components/ui/separator"

const initialData: Step1Data = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export function SignupForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect")

  const [step, setStep] = useState<1 | 2>(1)
  const [formData, setFormData] = useState<Step1Data>(initialData)
  const [otp, setOtp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    open: boolean
    type: "success" | "error"
    title: string
    description?: string
  }>({ open: false, type: "success", title: "" })

  const handleStep1Next = async () => {
    setIsSubmitting(true)
    try {
      await sendOtp(formData.email)
      setStep(2)
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        title: "Failed to send code",
        description: err instanceof Error ? err.message : "Please try again",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpVerified = useCallback(async () => {
    try {
      await verifyOtp({ email: formData.email, otp })
      await signup({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        username: formData.username,
      })
      await login({ email: formData.email, password: formData.password })
      setAlert({
        open: true,
        type: "success",
        title: "Account created!",
        description: "Welcome to code-takes. Redirecting you now...",
      })
      setTimeout(() => {
        window.location.href = redirectTo || "/feed"
      }, 1500)
    } catch (err) {
      setAlert({
        open: true,
        type: "error",
        title: "Signup failed",
        description: err instanceof Error ? err.message : "Please try again",
      })
    }
  }, [formData, otp])

  const handleOtpError = useCallback((message: string) => {
    setAlert({
      open: true,
      type: "error",
      title: "Verification failed",
      description: message,
    })
  }, [])

  return (
    <AuthCard>
      {step === 1 ? (
        <SignupStep1 data={formData} onChange={setFormData} onNext={handleStep1Next} loading={isSubmitting} />
      ) : (
        <SignupStep2
          email={formData.email}
          otp={otp}
          onOtpChange={setOtp}
          onVerified={handleOtpVerified}
          onError={handleOtpError}
        />
      )}

      <div className="mt-6">
        <Separator className="my-4" />
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href={`/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`} className="font-semibold text-foreground underline underline-offset-2 hover:no-underline">
            Log in
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

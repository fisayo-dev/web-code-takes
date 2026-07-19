"use client"

import { useState, useEffect, useCallback } from "react"
import { sendOtp } from "@/lib/api"
import { OtpInput } from "@/components/ui/otp-input"

interface SignupStep2Props {
  email: string
  otp: string
  onOtpChange: (otp: string) => void
  onVerified: () => Promise<void>
  onError: (message: string) => void
}

export function SignupStep2({ email, otp, onOtpChange, onVerified, onError }: SignupStep2Props) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleVerify = async () => {
    if (otp.length !== 6) return
    setIsVerifying(true)
    try {
      await onVerified()
    } catch (err) {
      onError(err instanceof Error ? err.message : "Verification failed")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResend = useCallback(async () => {
    if (countdown > 0) return
    setIsResending(true)
    try {
      await sendOtp(email)
      setCountdown(30)
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to resend code")
    } finally {
      setIsResending(false)
    }
  }, [email, countdown, onError])

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-lg font-bold uppercase tracking-tight">Verify Email</h1>
        <p className="text-xs text-muted-foreground">
          We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <OtpInput value={otp} onChange={onOtpChange} disabled={isVerifying} />
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={otp.length !== 6 || isVerifying}
        className="neo-btn-green w-full py-2.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0"
      >
        {isVerifying ? "Verifying..." : "Verify Code"}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        Didn&apos;t receive it?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0 || isResending}
          className="font-semibold text-foreground underline underline-offset-2 hover:no-underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : isResending ? "Sending..." : "Resend code"}
        </button>
      </p>
    </div>
  )
}

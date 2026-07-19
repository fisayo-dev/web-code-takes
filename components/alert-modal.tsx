"use client"

import { useEffect, useRef } from "react"
import { CheckCircle, XCircle, X } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface AlertModalProps {
  open: boolean
  onClose: () => void
  type: "success" | "error"
  title: string
  description?: string
}

export function AlertModal({ open, onClose, type, title, description }: AlertModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (!open || type !== "success") return
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [open, type, onClose])

  const handleClose = () => {
    dialogRef.current?.close()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "backdrop:bg-black/50 p-0 m-auto rounded-none",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        "closing:animate-out closing:fade-out-0 closing:zoom-out-95",
      )}
    >
      <div
        className={cn(
          "relative w-full max-w-sm p-6 neo-card bg-card",
          type === "success" ? "neo-alert-success" : "neo-alert-error",
        )}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 hover:bg-muted rounded"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="flex flex-col items-center gap-3 text-center">
          {type === "success" ? (
            <CheckCircle className="size-10" weight="bold" style={{ color: "var(--accent-green)" }} />
          ) : (
            <XCircle className="size-10" weight="bold" style={{ color: "var(--accent-red)" }} />
          )}

          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wide">{title}</h2>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>

          <button
            onClick={handleClose}
            className="neo-btn mt-2 px-6 py-2 text-xs"
          >
            {type === "success" ? "Continue" : "Try Again"}
          </button>
        </div>
      </div>
    </dialog>
  )
}

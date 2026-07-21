"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertModal } from "@/components/alert-modal"
import { checkUsername, updateProfile, deleteAccount } from "@/lib/api"
import { clearAuthToken } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Trash, X, Warning } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"

interface EditProfileDialogProps {
  open: boolean
  onClose: () => void
  profile: User
  onUpdate: (updater: (prev: User) => User) => void
}

export function EditProfileDialog({ open, onClose, profile, onUpdate }: EditProfileDialogProps) {
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

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "backdrop:bg-black/80 backdrop:blur-2xl p-0 m-auto rounded",
        "open:animate-in open:fade-in-0 open:zoom-in-95",
        "closing:animate-out closing:fade-out-0 closing:zoom-out-95",
      )}
    >
      <div className="relative w-auto md:w-lg p-6 neo-card bg-card">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-muted rounded text-muted-foreground hover:text-white"
          aria-label="Close"
        >
          <X className="size-4" />
        </button>

        <div className="space-y-1 mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">Edit Profile</h2>
          <p className="text-[10px] text-muted-foreground">Update your name and username</p>
        </div>

        {open && <EditProfileForm profile={profile} onClose={onClose} onUpdate={onUpdate} />}
      </div>
    </dialog>
  )
}

function EditProfileForm({ profile, onClose, onUpdate }: { profile: User; onClose: () => void; onUpdate: (updater: (prev: User) => User) => void }) {
  const router = useRouter()

  const [name, setName] = useState(profile.name)
  const [username, setUsername] = useState(profile.username)
  const [errors, setErrors] = useState<{ name?: string; username?: string }>({})
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle")
  const [isSaving, setIsSaving] = useState(false)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [alert, setAlert] = useState<{ type: "success" | "error"; title: string; description?: string } | null>(null)

  const checkUsernameAvailability = useCallback(async (value: string) => {
    if (value.length < 3 || value === profile.username) {
      setUsernameStatus("idle")
      return
    }
    setUsernameStatus("checking")
    try {
      await checkUsername(value)
      setUsernameStatus("available")
    } catch {
      setUsernameStatus("taken")
    }
  }, [profile.username])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) checkUsernameAvailability(username)
    }, 500)
    return () => clearTimeout(timer)
  }, [username, checkUsernameAvailability])

  const validate = (): boolean => {
    const newErrors: { name?: string; username?: string } = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!username.trim()) {
      newErrors.username = "Username is required"
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (usernameStatus === "taken") {
      newErrors.username = "Username is already taken"
    } else if (usernameStatus === "checking") {
      newErrors.username = "Checking availability..."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSaving(true)
    try {
      const payload: { name?: string; username?: string } = {}
      if (name.trim() !== profile.name) payload.name = name.trim()
      if (username.trim() !== profile.username) payload.username = username.trim()

      if (Object.keys(payload).length === 0) {
        onClose()
        return
      }

      const updated = await updateProfile(payload)
      onUpdate((prev) => ({ ...prev, ...updated }))
      setAlert({ type: "success", title: "Profile updated" })
    } catch (err) {
      setAlert({
        type: "error",
        title: "Update failed",
        description: err instanceof Error ? err.message : "Something went wrong",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAccount()
      clearAuthToken()
      setAlert({ type: "success", title: "Account deleted" })
      setTimeout(() => {
        router.push("/login")
        router.refresh()
      }, 1500)
    } catch (err) {
      setAlert({
        type: "error",
        title: "Deletion failed",
        description: err instanceof Error ? err.message : "Something went wrong",
      })
      setIsDeleting(false)
    }
  }

  const handleCloseAlert = () => {
    setAlert(null)
    if (alert?.type === "success" && alert.title === "Profile updated") {
      onClose()
    }
  }

  const inputClass = (field: "name" | "username") =>
    cn(errors[field] && "border-accent-red focus:outline-accent-red/30")

  return (
    <>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-name" className="font-semibold text-white uppercase text-[10px] tracking-wider">
            Name
          </Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors((prev) => ({ ...prev, name: undefined }))
            }}
            className={inputClass("name")}
          />
          {errors.name && <p className="text-[10px] text-accent-red">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="edit-username" className="font-semibold text-white uppercase text-[10px] tracking-wider">
            Username
          </Label>
          <Input
            id="edit-username"
            value={username}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
              setUsername(val)
              setErrors((prev) => ({ ...prev, username: undefined }))
            }}
            className={inputClass("username")}
          />
          {username && username !== profile.username && usernameStatus === "available" && (
            <p className="text-[10px] text-primary">Username is available</p>
          )}
          {username && username !== profile.username && usernameStatus === "taken" && !errors.username && (
            <p className="text-[10px] text-accent-red">Username is already taken</p>
          )}
          {errors.username && <p className="text-[10px] text-accent-red">{errors.username}</p>}
        </div>

        <div className="flex gap-2 mt-1">
          <Button type="button" variant="outline" onClick={onClose} className="text-white flex-1">
            Cancel
          </Button>
          <Button type="submit" variant="neo" disabled={isSaving} className="flex-1">
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <div className="mt-5 pt-4 border-t border-border">
        {!showDeleteConfirm ? (
          <Button
            variant="neo-destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full"
          >
            <Trash className="size-3.5" />
            Delete Account
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-3 rounded bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/20">
              <Warning className="size-4 shrink-0 text-[var(--accent-red)]" />
              <p className="text-[10px] text-[var(--accent-red)]">
                This action is irreversible. All your data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="neo-destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <AlertModal
        open={!!alert}
        onClose={handleCloseAlert}
        type={alert?.type ?? "error"}
        title={alert?.title ?? ""}
        description={alert?.description}
      />
    </>
  )
}
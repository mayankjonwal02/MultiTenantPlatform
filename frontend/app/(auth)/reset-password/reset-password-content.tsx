"use client"

import { useSearchParams } from "next/navigation"
import ResetPasswordForm from "@/components/auth/reset-password-form"

export default function ResetPasswordPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const email = searchParams.get("email") || ""

  if (!token || !email) {
    return (
      <div className="text-center text-muted-foreground">
        Invalid reset link. Please request a new password reset.
      </div>
    )
  }

  return <ResetPasswordForm token={token} email={email} />
}

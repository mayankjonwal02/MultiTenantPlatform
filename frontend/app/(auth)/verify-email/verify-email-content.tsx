"use client"

import { useSearchParams } from "next/navigation"
import EmailVerificationForm from "@/components/auth/email-verification-form"

export default function VerifyEmailPageContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const userId = searchParams.get("user_id") || ""

  if (!token || !userId) {
    return (
      <div className="text-center text-muted-foreground">
        Invalid verification link.
      </div>
    )
  }

  return <EmailVerificationForm token={token} userId={userId} />
}

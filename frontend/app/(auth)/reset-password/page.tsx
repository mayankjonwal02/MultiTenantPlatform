import { Suspense } from "react"
import ResetPasswordPageContent from "./reset-password-content"

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ResetPasswordPageContent />
      </Suspense>
    </div>
  )
}
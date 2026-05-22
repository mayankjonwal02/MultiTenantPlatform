import { Suspense } from "react"
import ResetPasswordPageContent from "./reset-password-content"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}

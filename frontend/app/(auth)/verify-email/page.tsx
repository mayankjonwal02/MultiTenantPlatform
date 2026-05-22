import { Suspense } from "react"
import VerifyEmailPageContent from "./verify-email-content"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    }>
      <VerifyEmailPageContent />
    </Suspense>
  )
}

import { Suspense } from "react"
import VerifyEmailPageContent from "./verify-email-content"

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <VerifyEmailPageContent />
      </Suspense>
    </div>
  )
}
import { Suspense } from "react"
import AcceptInviteContent from "./accept-invite-content"

export default function AcceptInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-center text-muted-foreground">Loading invitation...</div>
        }
      >
        <AcceptInviteContent />
      </Suspense>
    </div>
  )
}
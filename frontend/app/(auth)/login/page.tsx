import { Suspense } from "react"
import LoginForm from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

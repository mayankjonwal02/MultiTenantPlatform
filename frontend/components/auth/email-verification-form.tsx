"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { verifyEmail } from "@/services/auth.service"
import { getApiErrorMessage } from "@/lib/api/errors"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Mail, AlertCircle, ArrowLeft } from "lucide-react"

interface EmailVerificationFormProps {
  token: string
  userId: string
}

export default function EmailVerificationForm({ token, userId }: EmailVerificationFormProps) {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleVerify = async () => {
    try {
      setLoading(true)
      await verifyEmail(token, userId)
      setVerified(true)
      toast.success("Email verified successfully!")
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Invalid or expired verification token."))
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
        <Card className="w-full max-w-md border-0 shadow-xl animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 mx-auto animate-bounce-subtle">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Email verified!</CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now log in to your account.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">Go to login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
      <Card className="w-full max-w-md border-0 shadow-xl animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 mx-auto">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            Click the button below to verify your email address and complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted/50 border border-border p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              This verification link was sent to your email address. If you didn&apos;t request this, you can safely ignore it.
            </p>
          </div>
          <Button onClick={handleVerify} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify email"
            )}
          </Button>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="ghost" className="gap-2" asChild>
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

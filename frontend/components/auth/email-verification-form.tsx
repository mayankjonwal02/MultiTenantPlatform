"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"

import { verifyEmail } from "@/services/auth.service"
import { getApiErrorMessage } from "@/lib/api/errors"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email verified!</CardTitle>
          <CardDescription>
            Your email has been successfully verified. You can now log in.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/login">Go to login</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Verify your email</CardTitle>
        <CardDescription>Click the button below to verify your email address</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={handleVerify} disabled={loading}>
          {loading ? "Verifying..." : "Verify email"}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
          Back to login
        </Link>
      </CardFooter>
    </Card>
  )
}

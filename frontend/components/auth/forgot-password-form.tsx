"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { forgotPassword } from "@/services/auth.service"
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validators/auth"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true)
      await forgotPassword(data.email)
      setSent(true)
      toast.success("If an account exists, a reset link has been sent.")
    } catch {
      toast.success("If an account exists, a reset link has been sent.")
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
        <Card className="w-full max-w-md border-0 shadow-xl animate-scale-in">
          <CardHeader className="text-center pb-4">
            <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 mx-auto animate-bounce-subtle">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>
              If an account with that email exists, we&apos;ve sent a password reset link to your inbox.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              The link will expire in 24 hours. If you don&apos;t see the email, check your spam folder.
            </p>
          </CardContent>
          <CardFooter className="justify-center">
            <Button variant="outline" className="gap-2" asChild>
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
      <Card className="w-full max-w-md border-0 shadow-xl animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 mx-auto">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 transition-colors ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email.message}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Remember your password?</span>
            </div>
          </div>
          <Button variant="outline" className="w-full gap-2" asChild>
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

"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { loginUser } from "@/services/auth.service"
import { useAuthStore } from "@/store/auth.store"
import { loginSchema, LoginFormData } from "@/lib/validators/auth"
import { getApiErrorMessage } from "@/lib/api/errors"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Lock, Mail } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setTokens = useAuthStore((state) => state.setTokens)
  const [loading, setLoading] = useState(false)
  const nextPath = searchParams.get("next")
  const redirectPath = nextPath?.startsWith("/") ? nextPath : "/dashboard"

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true)
      const response = await loginUser(data)
      setTokens(response.access, response.refresh)
      toast.success("Logged in successfully!")
      router.push(redirectPath)
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Invalid email or password."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 mx-auto">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className={`pl-10 transition-colors ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("password")} 
                />
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {errors.password.message}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">New to TenanHub?</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/signup">
              Create account
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

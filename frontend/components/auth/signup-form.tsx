"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { signupUser } from "@/services/auth.service"
import { signupSchema, SignupFormData } from "@/lib/validators/auth"
import { getApiErrorMessage } from "@/lib/api/errors"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, UserPlus, Mail, Lock, User } from "lucide-react"

export default function SignupForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true)
      await signupUser(data)
      toast.success("Account created! Please check your email to verify.")
      router.push("/login")
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Something went wrong. Please try again."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/30">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3 mx-auto">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create account</CardTitle>
          <CardDescription>Join TenanHub and start managing your teams</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="font-medium text-sm">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="first_name" 
                    placeholder="John" 
                    className={`pl-10 transition-colors ${errors.first_name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("first_name")} 
                  />
                </div>
                {errors.first_name && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.first_name.message}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name" className="font-medium text-sm">Last name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="last_name" 
                    placeholder="Doe" 
                    className={`pl-10 transition-colors ${errors.last_name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    {...register("last_name")} 
                  />
                </div>
                {errors.last_name && (
                  <div className="flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    {errors.last_name.message}
                  </div>
                )}
              </div>
            </div>

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
              <Label htmlFor="password" className="font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Minimum 8 characters" 
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
              <p className="text-xs text-muted-foreground">At least 8 characters with uppercase and numbers</p>
            </div>

            <Button type="submit" className="w-full" disabled={loading} size="lg">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Already have an account?</span>
            </div>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">
              Sign in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

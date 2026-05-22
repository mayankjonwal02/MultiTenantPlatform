import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signupSchema = z.object({
  email: z.string().email("Invalid email address").max(254),
  first_name: z.string().min(1, "First name is required").max(255),
  last_name: z.string().min(1, "Last name is required").max(255),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const emailVerificationSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
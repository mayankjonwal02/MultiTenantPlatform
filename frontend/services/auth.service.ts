import apiClient from "@/lib/api/client"
import { AuthResponse, LoginPayload, SignupPayload } from "@/types/auth"

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login/", payload)
  return response.data
}

export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/signup/", payload)
  return response.data
}

export const refreshToken = async (refresh: string) => {
  const response = await apiClient.post("/auth/refresh/", { refresh })
  return response.data
}

export const logoutUser = async (refresh: string) => {
  const response = await apiClient.post("/auth/logout/", { refresh })
  return response.data
}

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password/", { email })
  return response.data
}

export const resetPassword = async (token: string, email: string, password: string) => {
  const response = await apiClient.post("/auth/reset-password/", { token, email, password })
  return response.data
}

export const verifyEmail = async (token: string, userId: string) => {
  const response = await apiClient.post("/auth/verify-email/", { token, user_id: userId })
  return response.data
}

export interface LoginPayload {
  email: string
  password: string
}

export interface SignupPayload {
  email: string
  first_name: string
  last_name: string
  password: string
}

export interface AuthResponse {
  user_id: string
  access: string
  refresh: string
  message?: string
}

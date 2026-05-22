export type MembershipStatus = "invited" | "active" | "suspended"

export interface Membership {
  id: string
  user: string
  user_email?: string
  user_name?: string
  organization: string
  organization_name?: string
  role: string | null
  role_name?: string | null
  status: MembershipStatus
}

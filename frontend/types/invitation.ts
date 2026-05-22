export interface InvitationPayload {
  email: string
  role_id?: string
  organization_id?: string
}

export interface InvitationResponse {
  id: string
  email: string
  token: string
  organization: string
  organization_name: string
  role: string | null
  status: string
  created_at: string
  expires_at: string
}

export interface InvitationAcceptResponse {
  message: string
  organization?: string
  requires_auth?: boolean
  email?: string
}

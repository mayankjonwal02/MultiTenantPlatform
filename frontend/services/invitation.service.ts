import apiClient from "@/lib/api/client"
import {
  InvitationAcceptResponse,
  InvitationPayload,
  InvitationResponse,
} from "@/types/invitation"

export const createInvitation = async (
  payload: InvitationPayload
): Promise<InvitationResponse> => {
  const response = await apiClient.post(
    "/invitations/",
    payload
  )
  return response.data
}

export const getInvitation = async (
  token: string
): Promise<InvitationResponse> => {
  const response = await apiClient.get(`/invitations/${token}/`)
  return response.data
}

export const acceptInvitation = async (
  token: string
): Promise<InvitationAcceptResponse> => {
  const response = await apiClient.post(`/invitations/${token}/`)
  return response.data
}

export const listInvitations = async () => {
  const response = await apiClient.get("/invitations/")
  return response.data
}

export const revokeInvitation = async (token: string) => {
  const response = await apiClient.delete(`/invitations/${token}/`)
  return response.data
}

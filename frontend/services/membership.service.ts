import apiClient from "@/lib/api/client"
import { Membership, MembershipStatus } from "@/types/membership"
import { ensureSelectedOrganization } from "@/services/organization.service"

export interface PaginatedMemberships {
  count: number
  next: string | null
  previous: string | null
  results: Membership[]
}

export interface CreateMembershipPayload {
  user: string
  organization: string
  role?: string
  status?: MembershipStatus
}

export interface UpdateMembershipPayload {
  role?: string
  status?: MembershipStatus
}

export const getMemberships = async (
  page: number = 1
): Promise<PaginatedMemberships> => {
  const selectedOrganization = await ensureSelectedOrganization()

  if (!selectedOrganization) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    }
  }

  const response = await apiClient.get("/memberships/", {
    params: { page },
  })
  return response.data
}

export const getMembership = async (
  id: string
): Promise<Membership> => {
  const response = await apiClient.get(
    `/memberships/${id}/`
  )
  return response.data
}

export const createMembership = async (
  payload: CreateMembershipPayload
): Promise<Membership> => {
  const response = await apiClient.post(
    "/memberships/",
    payload
  )
  return response.data
}

export const updateMembership = async (
  id: string,
  payload: UpdateMembershipPayload
): Promise<Membership> => {
  const response = await apiClient.patch(
    `/memberships/${id}/`,
    payload
  )
  return response.data
}

export const deleteMembership = async (
  id: string
): Promise<void> => {
  await apiClient.delete(`/memberships/${id}/`)
}

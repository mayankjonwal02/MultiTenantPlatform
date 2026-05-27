import apiClient from "@/lib/api/client"
import { Organization } from "@/types/organization"
import Cookies from "js-cookie"

export interface CreateOrganizationPayload {
  name: string
  slug: string
  subscription_plan?: string
}

export const createOrganization = async (
  payload: CreateOrganizationPayload
): Promise<Organization> => {
  const response = await apiClient.post(
    "/organizations/create/",
    payload
  )
  return response.data
}

export const listOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get("/organizations/")
  return response.data
}

export const getOrganization = async (
  id: string
): Promise<Organization> => {
  const response = await apiClient.get(
    `/organizations/${id}/`
  )
  return response.data
}

export const updateOrganization = async (
  id: string,
  payload: Partial<CreateOrganizationPayload>
): Promise<Organization> => {
  const response = await apiClient.put(
    `/organizations/${id}/`,
    payload
  )
  return response.data
}

export const transferOwnership = async (
  orgId: string,
  membershipId: string
): Promise<void> => {
  await apiClient.post(`/organizations/${orgId}/transfer-ownership/`, {
    membership_id: membershipId,
  })
}

export const ensureSelectedOrganization = async (): Promise<Organization | null> => {
  const selectedTenantId = Cookies.get("tenant_id")
  const organizations = await listOrganizations()

  if (organizations.length === 0) {
    Cookies.remove("tenant_id")
    return null
  }

  const selectedOrganization = organizations.find(
    (organization) => organization.id === selectedTenantId
  )

  if (selectedOrganization) {
    return selectedOrganization
  }

  const fallbackOrganization = organizations[0]
  Cookies.set("tenant_id", fallbackOrganization.id)

  return fallbackOrganization
}

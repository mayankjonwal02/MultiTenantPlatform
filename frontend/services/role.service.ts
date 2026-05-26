import apiClient from "@/lib/api/client"

export interface Role {
  id: string
  name: string
  description: string
  organization: string
  organization_name: string
  is_system: boolean
  permissions: Permission[]
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  permission: string
  permission_display: string
  created_at: string
}

export const listRoles = async () => {
  const response = await apiClient.get("/roles/")
  return response.data
}

export const getRoleById = async (id: string) => {
  const response = await apiClient.get(`/roles/${id}/`)
  return response.data
}

export const createRole = async (data: {
  name: string
  description?: string
  permissions?: string[]
}) => {
  const response = await apiClient.post("/roles/", data)
  return response.data
}

export const updateRole = async (
  id: string,
  data: {
    name?: string
    description?: string
  }
) => {
  const response = await apiClient.patch(`/roles/${id}/`, data)
  return response.data
}

export const updateRolePermissions = async (
  id: string,
  permissions: string[]
) => {
  const response = await apiClient.patch(`/roles/${id}/permissions/`, {
    permissions,
  })
  return response.data
}

export const deleteRole = async (id: string) => {
  const response = await apiClient.delete(`/roles/${id}/`)
  return response.data
}

"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Building2 } from "lucide-react"

import { listOrganizations } from "@/services/organization.service"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function OrganizationSwitcher() {
  const queryClient = useQueryClient()
  const [selectedOrganizationId, setSelectedOrganizationId] = useState("")

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
  })

  const cookieOrganizationId = Cookies.get("tenant_id")
  const selectedOrganization = organizations.find(
    (organization) => organization.id === selectedOrganizationId
  )
  const cookieOrganization = organizations.find(
    (organization) => organization.id === cookieOrganizationId
  )
  const currentOrganizationId =
    selectedOrganization?.id ?? cookieOrganization?.id ?? organizations[0]?.id ?? ""

  useEffect(() => {
    if (organizations.length === 0) {
      Cookies.remove("tenant_id")
      return
    }

    const currentTenantId = Cookies.get("tenant_id")
    const currentOrganization = organizations.find(
      (organization) => organization.id === currentTenantId
    )

    if (!currentOrganization) {
      Cookies.set("tenant_id", organizations[0].id)
    }
  }, [organizations])

  const handleChange = (organizationId: string) => {
    Cookies.set("tenant_id", organizationId)
    setSelectedOrganizationId(organizationId)
    queryClient.invalidateQueries({ queryKey: ["memberships"] })
  }

  if (organizations.length === 0) {
    return null
  }

  return (
    <div className="flex min-w-56 items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select value={currentOrganizationId} onValueChange={handleChange}>
        <SelectTrigger className="h-9">
          <SelectValue placeholder="Select organization" />
        </SelectTrigger>
        <SelectContent>
          {organizations.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {organization.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

"use client"

import Link from "next/link"
import Cookies from "js-cookie"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Building2, Plus } from "lucide-react"

import { listOrganizations } from "@/services/organization.service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function OrganizationsList() {
  const queryClient = useQueryClient()
  const selectedOrganizationId = Cookies.get("tenant_id")

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
  })

  const handleSelectOrganization = (organizationId: string) => {
    Cookies.set("tenant_id", organizationId)
    queryClient.invalidateQueries({ queryKey: ["memberships"] })
    queryClient.invalidateQueries({ queryKey: ["organizations"] })
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (organizations.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <Building2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <h2 className="mb-2 text-lg font-semibold">No organizations yet</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Create an organization to start managing members.
        </p>
        <Button asChild>
          <Link href="/dashboard/organizations/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {organizations.map((organization) => {
        const isSelected = selectedOrganizationId === organization.id

        return (
          <Card key={organization.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">{organization.name}</CardTitle>
              {isSelected && <Badge variant="outline">Selected</Badge>}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Slug: {organization.slug}</p>
                <p>Plan: {organization.subscription_plan ?? "free"}</p>
              </div>
              <Button
                variant={isSelected ? "secondary" : "outline"}
                size="sm"
                onClick={() => handleSelectOrganization(organization.id)}
              >
                {isSelected ? "Current organization" : "Select organization"}
              </Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

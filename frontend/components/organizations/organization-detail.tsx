"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { getOrganization } from "@/services/organization.service"
import { getMemberships } from "@/services/membership.service"
import { Users, Zap, Edit, Shield, Settings } from "lucide-react"

interface OrganizationDetailProps {
  id: string
}

export default function OrganizationDetail({ id }: OrganizationDetailProps) {
  const { data: organization, isLoading: orgLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id),
  })

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["memberships", id],
    queryFn: () => getMemberships(parseInt(id)),
  })

  if (orgLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!organization) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Organization not found
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{organization.name}</CardTitle>
            <CardDescription>Organization details and settings</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/dashboard/organizations/${id}/edit`} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Organization ID</p>
              <p className="font-mono text-sm">{organization.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Slug</p>
              <p className="font-mono text-sm">{organization.slug}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Subscription Plan</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{organization.subscription_plan || "free"}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <Skeleton className="h-12" />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                <div>
                  <p className="font-semibold">{members?.count || 0}</p>
                  <p className="text-sm text-muted-foreground">Total members</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/members">Manage Members</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/invitations">
              Send Invitation
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/members">
              View All Members
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Administration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href={`/dashboard/organizations/${id}/admin/roles`}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Roles
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href={`/dashboard/organizations/${id}/admin/members`}>
              <Shield className="h-4 w-4 mr-2" />
              Member Permissions
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

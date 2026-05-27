"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { getOrganization } from "@/services/organization.service"
import { Crown, Users, Zap, Edit, Shield, Settings, Calendar, ArrowRightLeft } from "lucide-react"
import TransferOwnershipModal from "@/components/organizations/transfer-ownership-modal"

interface OrganizationDetailProps {
  id: string
}

export default function OrganizationDetail({ id }: OrganizationDetailProps) {
  const [transferModalOpen, setTransferModalOpen] = useState(false)

  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id),
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
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

  const formattedDate = organization.created_at
    ? new Date(organization.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{organization.name}</CardTitle>
            <CardDescription>Organization details and settings</CardDescription>
            {formattedDate && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Calendar className="h-3 w-3" />
                <span>Created {formattedDate}</span>
              </div>
            )}
          </div>
          <Button asChild>
            <Link href={`/dashboard/organizations/${id}/edit`} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Organization ID</p>
              <p className="font-mono text-sm break-all">{organization.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Slug</p>
              <p className="font-mono text-sm">{organization.slug}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subscription Plan</p>
              <Badge variant="outline" className="capitalize">
                {organization.subscription_plan || "free"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ownership */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Ownership
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
            <div className="space-y-0.5">
              <p className="font-semibold">{organization.owner_name || "—"}</p>
              {organization.owner_email && (
                <p className="text-sm text-muted-foreground">{organization.owner_email}</p>
              )}
            </div>
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Owner
            </Badge>
          </div>

          {organization.is_owner && (
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
              onClick={() => setTransferModalOpen(true)}
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transfer Ownership
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
            <div>
              <p className="font-semibold">{organization.member_count ?? 0}</p>
              <p className="text-sm text-muted-foreground">Active members</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/members">Manage Members</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/invitations">Send Invitation</Link>
          </Button>
          <Button asChild variant="outline" className="w-full justify-start">
            <Link href="/dashboard/members">View All Members</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Administration */}
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

      <TransferOwnershipModal
        isOpen={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        organizationId={id}
        organizationName={organization.name}
      />
    </div>
  )
}

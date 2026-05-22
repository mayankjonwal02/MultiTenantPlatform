"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { getMemberships } from "@/services/membership.service"
import { listOrganizations } from "@/services/organization.service"
import { Users, Building2 } from "lucide-react"

export default function DashboardPage() {
  const { data: organizations = [], isLoading: organizationsLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
  })

  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["memberships", 1],
    queryFn: () => getMemberships(1),
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {membershipsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{memberships?.count ?? 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            {organizationsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{organizations.length}</div>
            )}
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/organizations">
                <Building2 className="mr-2 h-4 w-4" />
                View Organizations
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        <h2 className="mb-2 text-lg font-semibold">Welcome to your dashboard</h2>
        <p className="mb-4 text-sm">
          Get started by creating an organization or inviting members.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/dashboard/organizations/create">
              <Building2 className="mr-2 h-4 w-4" />
              Create Organization
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/members">
              <Users className="mr-2 h-4 w-4" />
              View Members
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

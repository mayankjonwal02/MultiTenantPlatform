"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Breadcrumb from "@/components/common/breadcrumb"
import { getMemberships } from "@/services/membership.service"
import { listOrganizations } from "@/services/organization.service"
import { Users, Building2, Mail, Zap, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const { data: organizations = [], isLoading: organizationsLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
  })

  const { data: memberships, isLoading: membershipsLoading } = useQuery({
    queryKey: ["memberships", 1],
    queryFn: () => getMemberships(1),
  })

  const StatCard = ({ icon: Icon, label, value, loading, delay }: any) => (
    <Card className="group hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-20 animate-shimmer" />
        ) : (
          <div className="text-3xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div className="animate-fade-in">
        <Breadcrumb items={[{ label: "Dashboard" }]} />
      </div>

      {/* Welcome Section */}
      <div className="space-y-2 animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground">
          Manage your organizations, members, and team collaboration
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          icon={Building2} 
          label="Organizations" 
          value={organizations.length} 
          loading={organizationsLoading}
          delay={0}
        />
        <StatCard 
          icon={Users} 
          label="Total Members" 
          value={memberships?.count ?? 0} 
          loading={membershipsLoading}
          delay={100}
        />
        <Card className="group hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
            <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
              <Zap className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{organizations.length > 0 ? organizations[0]?.id ? 1 : 0 : 0}</div>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <div className="rounded-lg bg-green-100 dark:bg-green-900/20 p-2">
              <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse-soft" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
        {/* Create Organization Card */}
        <Card className="group hover:shadow-lg transition-all hover:border-primary/50 border-dashed border-2 hover:bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Create Organization
            </CardTitle>
            <CardDescription>
              Set up a new organization to manage your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full gap-2">
              <Link href="/dashboard/organizations/create">
                Create now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Invite Members Card */}
        <Card className="group hover:shadow-lg transition-all hover:border-primary/50 border-dashed border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Invite Members
            </CardTitle>
            <CardDescription>
              Add team members to your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full gap-2" variant={organizations.length === 0 ? "outline" : "default"}>
              <Link href={organizations.length > 0 ? "/dashboard/invitations" : "/dashboard/organizations/create"}>
                {organizations.length > 0 ? "Invite members" : "Create org first"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Organizations Overview */}
      {organizations.length > 0 && (
        <Card className="animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Your Organizations</CardTitle>
              <CardDescription>
                Manage your organizations and team members
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="self-start sm:self-auto">
              <Link href="/dashboard/organizations">
                View all
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {organizations.slice(0, 3).map((org: any) => (
                <Link 
                  key={org.id} 
                  href={`/dashboard/organizations/${org.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-muted-foreground">{org.slug}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {organizations.length === 0 && (
        <Card className="border-dashed animate-fade-in-up" style={{ animationDelay: "400ms" }}>
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-lg bg-primary/10 p-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">No organizations yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get started by creating your first organization
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href="/dashboard/organizations/create">
                Create your first organization
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

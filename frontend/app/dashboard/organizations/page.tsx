import Link from "next/link"
import { Plus } from "lucide-react"

import Breadcrumb from "@/components/common/breadcrumb"
import OrganizationsList from "@/components/organizations/organizations-list"
import { Button } from "@/components/ui/button"

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Organizations" }]} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Organizations</h1>
          <p className="mt-1 text-muted-foreground">Manage your organizations and members</p>
        </div>
        <Button asChild className="self-start sm:self-auto">
          <Link href="/dashboard/organizations/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Organization
          </Link>
        </Button>
      </div>
      <OrganizationsList />
    </div>
  )
}

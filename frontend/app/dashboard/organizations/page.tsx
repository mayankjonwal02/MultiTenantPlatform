import Link from "next/link"
import { Plus } from "lucide-react"

import OrganizationsList from "@/components/organizations/organizations-list"
import { Button } from "@/components/ui/button"

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
        <Button asChild>
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

import AdminRolesList from "@/components/admin/admin-roles-list"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RolesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/organizations" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-3xl font-bold">Roles Management</h1>
      </div>

      <AdminRolesList />
    </div>
  )
}

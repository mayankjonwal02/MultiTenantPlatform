import Breadcrumb from "@/components/common/breadcrumb"
import OrganizationEditForm from "@/components/organizations/organization-edit-form"

interface OrganizationEditPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrganizationEditPage({ params }: OrganizationEditPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organizations", href: "/dashboard/organizations" },
          { label: "Edit" }
        ]} />
      </div>

      <OrganizationEditForm id={id} />
    </div>
  )
}

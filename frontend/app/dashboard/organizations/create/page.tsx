import Breadcrumb from "@/components/common/breadcrumb"
import CreateOrganizationForm from "@/components/organizations/create-organization-form"

export default function CreateOrganizationPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Organizations", href: "/dashboard/organizations" }, { label: "Create" }]} />
      <div className="flex justify-center">
        <CreateOrganizationForm />
      </div>
    </div>
  )
}

"use client"

import Breadcrumb from "@/components/common/breadcrumb"
import OrganizationDetail from "@/components/organizations/organization-detail"

interface OrganizationPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function OrganizationPage({ params }: OrganizationPageProps) {
  const { id } = await params

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Organizations", href: "/dashboard/organizations" },
          { label: "Details" }
        ]} />
      </div>

      <OrganizationDetail id={id} />
    </div>
  )
}

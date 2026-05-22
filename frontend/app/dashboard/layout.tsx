import Sidebar from "@/components/layout/sidebar"
import UserNav from "@/components/layout/user-nav"
import OrganizationSwitcher from "@/components/organizations/organization-switcher"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-end gap-4 border-b px-6">
          <OrganizationSwitcher />
          <UserNav />
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

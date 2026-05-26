import Sidebar from "@/components/layout/sidebar"
import MobileNav from "@/components/layout/mobile-nav"
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
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center gap-2 border-b px-4 md:px-6">
          <MobileNav />
          <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
            <OrganizationSwitcher />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

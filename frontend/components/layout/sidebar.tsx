"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Building2,
  Mail,
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Members",
    href: "/dashboard/members",
    icon: Users,
  },
  {
    title: "Invitations",
    href: "/dashboard/invitations",
    icon: Mail,
  },
  {
    title: "Organizations",
    href: "/dashboard/organizations",
    icon: Building2,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="mb-6 px-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="h-5 w-5" />
            <span>Multi Tenant</span>
          </Link>
        </div>
        <nav className="flex flex-col gap-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

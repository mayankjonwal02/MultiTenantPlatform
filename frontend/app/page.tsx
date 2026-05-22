import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Shield, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Building2 className="h-5 w-5" />
          <span>Multi Tenant Platform</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login" suppressHydrationWarning>
              Log in
            </Link>
          </Button>
          <Button asChild>
            <Link href="/signup" suppressHydrationWarning>
              Sign up
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-6 py-24 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Multi-Tenant SaaS Platform
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            A production-grade platform for managing organizations, members, roles, and invitations.
            Built with Django REST Framework and Next.js.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup" suppressHydrationWarning>
                Get started
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login" suppressHydrationWarning>
                Log in
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mx-auto px-6 py-16">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border p-6 text-center">
              <Building2 className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h2 className="mb-2 text-xl font-semibold">Organizations</h2>
              <p className="text-sm text-muted-foreground">
                Create and manage multiple organizations with custom slugs and subscription plans.
              </p>
            </div>
            <div className="rounded-lg border p-6 text-center">
              <Users className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h2 className="mb-2 text-xl font-semibold">Members & Roles</h2>
              <p className="text-sm text-muted-foreground">
                Invite members, assign roles, and manage membership status across organizations.
              </p>
            </div>
            <div className="rounded-lg border p-6 text-center">
              <Shield className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h2 className="mb-2 text-xl font-semibold">Authentication</h2>
              <p className="text-sm text-muted-foreground">
                Secure JWT-based authentication with email verification and password reset flows.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t px-6 py-6 text-center text-sm text-muted-foreground">
        &copy; 2026 Multi Tenant Platform. All rights reserved.
      </footer>
    </div>
  )
}

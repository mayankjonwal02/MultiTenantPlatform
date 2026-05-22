import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Shield, Users, Zap, Lock, GitBranch } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/30">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight group">
            <div className="rounded-lg bg-primary p-1.5 group-hover:shadow-lg transition-shadow">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span>TenanHub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-6 py-20 sm:py-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 h-96 w-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 h-96 w-96 bg-accent/10 rounded-full blur-3xl -ml-48 -mb-48" />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-block animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
                <Zap className="h-4 w-4 mr-2 text-primary" />
                <span className="text-sm font-medium">Production-ready SaaS platform</span>
              </div>
            </div>

            <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              Enterprise-Grade Organization Management
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-lg sm:text-xl text-muted-foreground text-balance animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              Built with Next.js and Django REST Framework. Manage multiple organizations, invite members, assign roles, and streamline your team collaboration with a powerful multi-tenant architecture.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <Button size="lg" asChild className="gap-2">
                <Link href="/signup">
                  Get started for free
                  <Zap className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Sign in to your account</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "500ms" }}>
              No credit card required. Free tier includes up to 3 organizations.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 sm:py-28 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything you need to scale
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A complete solution for managing complex organizational structures and team collaborations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
              {/* Feature 1 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Multi-Organization Management</h3>
                  <p className="text-muted-foreground">
                    Create and manage multiple organizations with custom slugs, subscription plans, and flexible member assignments.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Role-Based Access Control</h3>
                  <p className="text-muted-foreground">
                    Assign roles (admin, member) with granular permission management and invitation-based onboarding.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 hover:shadow-lg transition-all hover:border-primary/50 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Enterprise Security</h3>
                  <p className="text-muted-foreground">
                    JWT-based authentication, email verification, password reset flows, and secure session management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Stack Section */}
        <section className="px-6 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Built on modern technology
              </h2>
              <p className="text-lg text-muted-foreground">
                Powered by industry-leading frameworks and best practices
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 h-fit">
                  <GitBranch className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Backend Architecture</h3>
                  <p className="text-muted-foreground">
                    Django REST Framework provides a robust, production-ready API with comprehensive validation and authentication mechanisms.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 h-fit">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Frontend Framework</h3>
                  <p className="text-muted-foreground">
                    Next.js 14+ with React 18, TailwindCSS, and shadcn/ui for a modern, responsive user experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 h-fit">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">API Security</h3>
                  <p className="text-muted-foreground">
                    Implements JWT token management, request validation, CORS protection, and tenant isolation patterns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-3 h-fit">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Multi-Tenancy</h3>
                  <p className="text-muted-foreground">
                    Complete isolation between organizations with header-based tenant routing and database-level separation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20 sm:py-28 bg-muted/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of teams using TenanHub to manage their organizations and team collaboration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link href="/signup">
                  Create your first organization
                  <Zap className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Already have an account?</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 px-6 py-8 sm:py-12 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              <span className="font-semibold">TenanHub</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 text-center text-sm text-muted-foreground">
            &copy; 2026 TenanHub. Built for modern teams.
          </div>
        </div>
      </footer>
    </div>
  )
}

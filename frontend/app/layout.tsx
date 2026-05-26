import "./globals.css"

import QueryProvider from "@/providers/query-provider"
import { OrganizationProvider } from "@/providers/organization-provider"

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <OrganizationProvider>
            {children}
            <Toaster />
          </OrganizationProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

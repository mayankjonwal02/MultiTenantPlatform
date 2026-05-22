"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Cookies from "js-cookie"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"

import { acceptInvitation, getInvitation } from "@/services/invitation.service"
import { getApiErrorMessage } from "@/lib/api/errors"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function AcceptInviteContent() {
  const router = useRouter()
  const params = useParams<{ token: string }>()
  const token = params.token
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(false)

  const { data: invitation, isLoading } = useQuery({
    queryKey: ["invitation", token],
    queryFn: () => getInvitation(token),
    enabled: !!token,
  })

  const handleAccept = async () => {
    try {
      setLoading(true)
      const response = await acceptInvitation(token)

      if (response.organization) {
        Cookies.set("tenant_id", response.organization)
      }

      setAccepted(true)
      toast.success(response.message)
      router.push("/dashboard")
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Please log in with the invited email to accept."))
      router.push(`/login?next=/invite/${token}`)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <Skeleton className="mx-auto h-8 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-10 w-36" />
        </CardContent>
      </Card>
    )
  }

  if (accepted) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Invitation accepted!</CardTitle>
          <CardDescription>You can now access the organization.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Organization Invitation</CardTitle>
        <CardDescription>
          You have been invited to join {invitation?.organization_name || "an organization"}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Button onClick={handleAccept} disabled={loading || invitation?.status !== "pending"} size="lg">
          {loading ? "Processing..." : "Accept Invitation"}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-primary">
          I&apos;ll do this later
        </Link>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import Cookies from "js-cookie"

import { createOrganization } from "@/services/organization.service"
import { getApiErrorMessage } from "@/lib/api/errors"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50)
    .regex(/^[-a-zA-Z0-9_]+$/, "Slug can only contain letters, numbers, hyphens, and underscores"),
  subscription_plan: z.string().max(100).optional(),
})

type CreateOrgFormData = z.infer<typeof createOrgSchema>

export default function CreateOrganizationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrgFormData>({
    resolver: zodResolver(createOrgSchema),
  })

  const onSubmit = async (data: CreateOrgFormData) => {
    try {
      setLoading(true)
      const org = await createOrganization(data)
      Cookies.set("tenant_id", org.id)
      toast.success(`Organization "${org.name}" created!`)
      router.push("/dashboard/organizations")
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to create organization."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create Organization</CardTitle>
        <CardDescription>Set up a new organization for your team</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input id="name" placeholder="Acme Inc." {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" placeholder="acme-inc" {...register("slug")} />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Used in URLs. Letters, numbers, hyphens, and underscores only.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subscription_plan">Subscription Plan (optional)</Label>
            <Input id="subscription_plan" placeholder="free" {...register("subscription_plan")} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create organization"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

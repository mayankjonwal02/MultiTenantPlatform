"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getOrganization, updateOrganization } from "@/services/organization.service"
import { getApiErrorMessage } from "@/lib/api/errors"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface OrganizationEditFormProps {
  id: string
}

export default function OrganizationEditForm({ id }: OrganizationEditFormProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)

  const { data: organization, isLoading } = useQuery({
    queryKey: ["organization", id],
    queryFn: () => getOrganization(id),
  })

  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm({
    values: organization ? {
      name: organization.name,
      slug: organization.slug,
      subscription_plan: organization.subscription_plan || "free",
    } : {
      name: "",
      slug: "",
      subscription_plan: "free",
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateOrganization(id, data),
    onSuccess: () => {
      toast.success("Organization updated successfully")
      setIsEditing(false)
      router.push(`/dashboard/organizations/${id}`)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update organization"))
    },
  })

  const onSubmit = async (data: any) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  if (!organization) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          Organization not found
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        asChild
        className="gap-2 -ml-2 mb-4"
      >
        <Link href={`/dashboard/organizations/${id}`}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Organization</CardTitle>
          <CardDescription>
            Update your organization's details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                placeholder="My Company"
                {...register("name", {
                  required: "Organization name is required",
                })}
                disabled={updateMutation.isPending}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                placeholder="my-company"
                {...register("slug", {
                  required: "Slug is required",
                })}
                disabled={updateMutation.isPending}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message as string}</p>
              )}
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier for your organization
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription_plan">Subscription Plan</Label>
              <Select
                defaultValue={organization.subscription_plan || "free"}
                onValueChange={(value) => setValue("subscription_plan", value)}
                disabled={updateMutation.isPending}
              >
                <SelectTrigger id="subscription_plan">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset()
                  setIsEditing(false)
                }}
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

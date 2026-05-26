"use client"

import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { createRole, updateRole, updateRolePermissions } from "@/services/role.service"
import { getApiErrorMessage } from "@/lib/api/errors"

interface AdminRoleFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  role?: any
  onSuccess: () => void
}

const PERMISSIONS = [
  { code: "invite_members", label: "Invite Members" },
  { code: "manage_members", label: "Manage Members" },
  { code: "manage_roles", label: "Manage Roles" },
  { code: "manage_organization", label: "Manage Organization" },
]

export default function AdminRoleForm({
  isOpen,
  onOpenChange,
  role,
  onSuccess,
}: AdminRoleFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  useEffect(() => {
    if (role) {
      setName(role.name)
      setDescription(role.description || "")
      setSelectedPermissions(role.permissions?.map((p: any) => p.permission) || [])
    } else {
      setName("")
      setDescription("")
      setSelectedPermissions([])
    }
  }, [role, isOpen])

  const createMutation = useMutation({
    mutationFn: (data: { name: string; description: string; permissions: string[] }) =>
      createRole({
        name: data.name,
        description: data.description,
        permissions: data.permissions,
      }),
    onSuccess: () => {
      toast.success("Role created successfully")
      onOpenChange(false)
      onSuccess()
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to create role"))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await updateRole(role.id, {
        name: data.name,
        description: data.description,
      })
      await updateRolePermissions(role.id, data.permissions)
    },
    onSuccess: () => {
      toast.success("Role updated successfully")
      onOpenChange(false)
      onSuccess()
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to update role"))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter a role name")
      return
    }

    const data = {
      name,
      description,
      permissions: selectedPermissions,
    }

    if (role) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  const togglePermission = (code: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((p) => p !== code) : [...prev, code]
    )
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{role ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {role
              ? "Update the role details and permissions."
              : "Create a new role for your organization."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Role Name</Label>
            <Input
              id="name"
              placeholder="e.g., Editor, Viewer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What is this role for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="space-y-3">
            <Label>Permissions</Label>
            <div className="space-y-2 border rounded-lg p-3">
              {PERMISSIONS.map((permission) => (
                <div key={permission.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={permission.code}
                    checked={selectedPermissions.includes(permission.code)}
                    onCheckedChange={() => togglePermission(permission.code)}
                    disabled={isPending}
                  />
                  <Label
                    htmlFor={permission.code}
                    className="font-normal cursor-pointer"
                  >
                    {permission.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : role ? "Update Role" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

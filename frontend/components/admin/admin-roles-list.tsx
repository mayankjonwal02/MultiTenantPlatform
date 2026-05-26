"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { listRoles, deleteRole } from "@/services/role.service"
import { getApiErrorMessage } from "@/lib/api/errors"
import { Trash2, Edit2, Plus } from "lucide-react"
import AdminRoleForm from "./admin-role-form"

export default function AdminRolesList() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: listRoles,
  })
  const roles = rolesData?.results ?? rolesData ?? []

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      toast.success("Role deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["roles"] })
      setDeleteConfirm(null)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete role"))
    },
  })

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleEditRole = (role: any) => {
    setSelectedRole(role)
    setIsFormOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedRole(null)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setSelectedRole(null)
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["roles"] })
    handleFormClose()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Roles</CardTitle>
          </div>
          <Button onClick={handleCreateNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Role
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role: any) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">{role.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell>
                      {role.is_system ? (
                        <Badge variant="secondary">System</Badge>
                      ) : (
                        <Badge variant="outline">Custom</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions?.length > 0 ? (
                          role.permissions.map((perm: any) => (
                            <Badge key={perm.id} variant="outline" className="text-xs">
                              {perm.permission_display}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">No permissions</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {!role.is_system && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(role.id)}
                            disabled={deleteMutation.isPending}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {roles.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No roles yet. Create your first custom role.
            </div>
          )}
        </CardContent>
      </Card>

      <AdminRoleForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        role={selectedRole}
        onSuccess={handleFormSuccess}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete role?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The role will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

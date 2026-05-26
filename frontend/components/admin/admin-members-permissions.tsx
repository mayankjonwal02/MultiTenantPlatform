"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getMemberships, updateMembership } from "@/services/membership.service"
import { listRoles } from "@/services/role.service"
import { getApiErrorMessage } from "@/lib/api/errors"
import { Shield } from "lucide-react"

export default function AdminMembersPermissions() {
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [newRoleId, setNewRoleId] = useState<string>("")
  const [roleChangeConfirm, setRoleChangeConfirm] = useState(false)
  const queryClient = useQueryClient()

  const { data: membershipsData, isLoading: isMembershipsLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => getMemberships(),
  })
  const memberships = membershipsData?.results ?? []

  const { data: rolesData, isLoading: isRolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: listRoles,
  })
  const roles = rolesData?.results ?? rolesData ?? []

  const updateMemberRoleMutation = useMutation({
    mutationFn: (data: { memberId: string; roleId: string }) =>
      updateMembership(data.memberId, { role: data.roleId }),
    onSuccess: () => {
      toast.success("Member role updated successfully")
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      setRoleChangeConfirm(false)
      setSelectedMember(null)
      setNewRoleId("")
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update member role"))
    },
  })

  const handleRoleChange = (member: any, roleId: string) => {
    if (member.role?.id === roleId) return

    setSelectedMember(member)
    setNewRoleId(roleId)
    setRoleChangeConfirm(true)
  }

  const confirmRoleChange = () => {
    if (selectedMember && newRoleId) {
      updateMemberRoleMutation.mutate({
        memberId: selectedMember.id,
        roleId: newRoleId,
      })
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "invited":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isMembershipsLoading || isRolesLoading) {
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Member Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Change Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {memberships.map((membership: any) => (
                  <TableRow key={membership.id}>
                    <TableCell className="font-medium">
                      {membership.user_name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {membership.user_email}
                    </TableCell>
                    <TableCell>{membership.role_name || "No role"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(
                          membership.status
                        )}`}
                      >
                        {membership.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={membership.role?.id || ""}
                        onValueChange={(roleId) =>
                          handleRoleChange(membership, roleId)
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role: any) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {memberships.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No members in this organization yet.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={roleChangeConfirm} onOpenChange={setRoleChangeConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change member role?</DialogTitle>
            <DialogDescription>
              Change {selectedMember?.user_name}'s role from {selectedMember?.role_name}{" "}
              to {roles.find((r: any) => r.id === newRoleId)?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRoleChangeConfirm(false)}
              disabled={updateMemberRoleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmRoleChange}
              disabled={updateMemberRoleMutation.isPending}
            >
              {updateMemberRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  deleteMembership,
  getMemberships,
  PaginatedMemberships,
  updateMembership,
} from "@/services/membership.service"
import { MembershipStatus } from "@/types/membership"
import { getApiErrorMessage } from "@/lib/api/errors"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const pageSize = 20
const memberStatuses: MembershipStatus[] = ["active", "suspended", "invited"]

const statusColors: Record<MembershipStatus, string> = {
  invited: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

function isMembershipStatus(value: string): value is MembershipStatus {
  return memberStatuses.includes(value as MembershipStatus)
}

export default function MembersTable() {
  const [page, setPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState<MembershipStatus>("active")
  const [updating, setUpdating] = useState(false)

  const { data, isLoading, refetch } = useQuery<PaginatedMemberships>({
    queryKey: ["memberships", page],
    queryFn: () => getMemberships(page),
  })

  const handleStatusUpdate = async (id: string) => {
    try {
      setUpdating(true)
      await updateMembership(id, { status: newStatus })
      toast.success("Member status updated")
      setStatusDialogOpen(null)
      await refetch()
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to update member"))
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setUpdating(true)
      await deleteMembership(id)
      toast.success("Member removed")
      setDeleteDialogOpen(null)
      await refetch()
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, "Failed to remove member"))
    } finally {
      setUpdating(false)
    }
  }

  const handleStatusChange = (value: string) => {
    if (isMembershipStatus(value)) {
      setNewStatus(value)
    }
  }

  if (isLoading && !data) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="hidden sm:table-cell">Organization</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.results.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              data?.results.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-medium">{member.user_name ?? member.user_email ?? member.user}</div>
                    {member.user_email && (
                      <div className="text-xs text-muted-foreground">{member.user_email}</div>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{member.organization_name ?? member.organization}</TableCell>
                  <TableCell className="hidden sm:table-cell">{member.role_name ?? member.role ?? "-"}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[member.status]} variant="outline">
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setStatusDialogOpen(member.id)
                          setNewStatus(member.status)
                        }}
                        className="hidden sm:inline-flex"
                      >
                        Change Status
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => {
                          setStatusDialogOpen(member.id)
                          setNewStatus(member.status)
                        }}
                        className="sm:hidden"
                        title="Change Status"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteDialogOpen(member.id)}
                        className="hidden sm:inline-flex"
                      >
                        Remove
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        onClick={() => setDeleteDialogOpen(member.id)}
                        className="sm:hidden"
                        title="Remove"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {Math.max(1, Math.ceil(data.count / pageSize))} ({data.count} total)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!statusDialogOpen} onOpenChange={(open) => !open && setStatusDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Member Status</DialogTitle>
            <DialogDescription>Select a new status for this member.</DialogDescription>
          </DialogHeader>
          <Select value={newStatus} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => statusDialogOpen && handleStatusUpdate(statusDialogOpen)} disabled={updating}>
              {updating ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialogOpen && handleDelete(deleteDialogOpen)}
              disabled={updating}
            >
              {updating ? "Removing..." : "Remove"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

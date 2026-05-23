"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { listInvitations, revokeInvitation } from "@/services/invitation.service"
import { Trash2, Mail, Calendar, CheckCircle2, Clock } from "lucide-react"
import { getApiErrorMessage } from "@/lib/api/errors"

interface Invitation {
  token: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function InvitationsList() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ["invitations"],
    queryFn: listInvitations,
  })

  const revokeMutation = useMutation({
    mutationFn: revokeInvitation,
    onSuccess: () => {
      toast.success("Invitation revoked successfully")
      queryClient.invalidateQueries({ queryKey: ["invitations"] })
      setDeleteConfirm(null)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to revoke invitation"))
    },
  })

  const handleRevoke = (token: string) => {
    revokeMutation.mutate(token)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>
      case "accepted":
        return <Badge variant="outline" className="gap-1 border-green-200 text-green-700"><CheckCircle2 className="h-3 w-3" /> Accepted</Badge>
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      case "revoked":
        return <Badge variant="destructive">Revoked</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  if (invitations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          <Mail className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p>No invitations yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation: any) => (
        <Card key={invitation.token}>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 items-center gap-3 min-w-0">
                <div className="rounded-lg bg-primary/10 p-3 shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{invitation.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Role: {invitation.role}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">
                      Created: {formatDate(invitation.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {getStatusBadge(invitation.status)}
                {invitation.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirm(invitation.token)}
                    disabled={revokeMutation.isPending}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke invitation?</DialogTitle>
            <DialogDescription>
              This invitation will be revoked and the recipient won't be able to accept it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              onClick={() => deleteConfirm && handleRevoke(deleteConfirm)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

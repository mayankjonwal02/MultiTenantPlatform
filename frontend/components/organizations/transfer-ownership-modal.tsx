"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { getMemberships } from "@/services/membership.service"
import { transferOwnership } from "@/services/organization.service"
import { getApiErrorMessage } from "@/lib/api/errors"
import { AlertTriangle, Crown } from "lucide-react"

interface TransferOwnershipModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  organizationId: string
  organizationName: string
}

export default function TransferOwnershipModal({
  isOpen,
  onOpenChange,
  organizationId,
  organizationName,
}: TransferOwnershipModalProps) {
  const [stage, setStage] = useState<"select" | "confirm">("select")
  const [selectedMembershipId, setSelectedMembershipId] = useState("")
  const queryClient = useQueryClient()

  const { data: membershipsData, isLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => getMemberships(),
    enabled: isOpen,
  })

  const members = (membershipsData?.results ?? []).filter(
    (m: any) => m.role_name !== "Owner" && m.status === "active"
  )

  const selectedMember = members.find((m: any) => m.id === selectedMembershipId)

  const mutation = useMutation({
    mutationFn: () => transferOwnership(organizationId, selectedMembershipId),
    onSuccess: () => {
      toast.success("Ownership transferred successfully")
      queryClient.invalidateQueries({ queryKey: ["organization", organizationId] })
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      handleClose()
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to transfer ownership"))
    },
  })

  const handleClose = () => {
    setStage("select")
    setSelectedMembershipId("")
    onOpenChange(false)
  }

  const handleContinue = () => {
    if (!selectedMembershipId) {
      toast.error("Please select a member")
      return
    }
    setStage("confirm")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        {stage === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Transfer Ownership
              </DialogTitle>
              <DialogDescription>
                Select an existing active member to become the new owner of{" "}
                <strong>{organizationName}</strong>.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2">
              <Label htmlFor="new-owner">New Owner</Label>
              {isLoading ? (
                <div className="h-10 rounded-md border bg-muted animate-pulse" />
              ) : members.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No eligible members found. Invite members first before transferring ownership.
                </p>
              ) : (
                <Select value={selectedMembershipId} onValueChange={setSelectedMembershipId}>
                  <SelectTrigger id="new-owner">
                    <SelectValue placeholder="Select a member…" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member: any) => (
                      <SelectItem key={member.id} value={member.id}>
                        <span className="font-medium">{member.user_name}</span>
                        <span className="ml-2 text-muted-foreground text-xs">
                          {member.user_email}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!selectedMembershipId || members.length === 0}
              >
                Continue
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirm Ownership Transfer
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-1 text-sm">
              <p>
                You are about to transfer ownership of{" "}
                <strong>{organizationName}</strong> to{" "}
                <strong>{selectedMember?.user_name}</strong>{" "}
                ({selectedMember?.user_email}).
              </p>
              <p className="text-muted-foreground">
                You will become a regular member and lose owner privileges.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStage("select")} disabled={mutation.isPending}>
                Back
              </Button>
              <Button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="bg-destructive hover:bg-destructive/90"
              >
                {mutation.isPending ? "Transferring…" : "Confirm Transfer"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

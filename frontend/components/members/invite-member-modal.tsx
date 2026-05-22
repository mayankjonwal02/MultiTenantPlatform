import { useState } from "react"
import Cookies from "js-cookie"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createInvitation } from "@/services/invitation.service"
import { getApiErrorMessage } from "@/lib/api/errors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface InviteMemberModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function InviteMemberModal({
  isOpen,
  onOpenChange,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (payload: { email: string; organization_id: string }) =>
      createInvitation({
        email: payload.email,
        organization_id: payload.organization_id,
      }),
    onSuccess: () => {
      toast.success(`Invitation sent to ${email}`)
      setEmail("")
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, "Failed to send invitation"))
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter an email address")
      return
    }

    const organizationId = Cookies.get("tenant_id")
    if (!organizationId) {
      toast.error("Please select an organization first")
      return
    }

    mutation.mutate({ email, organization_id: organizationId })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to add a new member to your organization.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="member@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={mutation.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

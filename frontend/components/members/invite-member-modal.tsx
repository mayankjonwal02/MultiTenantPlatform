"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createInvitation } from "@/services/invitation.service"
import { listOrganizations } from "@/services/organization.service"
import { useOrganization } from "@/providers/organization-provider"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  const [selectedOrgId, setSelectedOrgId] = useState("")
  const queryClient = useQueryClient()
  const { setSelectedOrgId: setContextOrgId } = useOrganization()

  const { data: organizations = [] } = useQuery({
    queryKey: ["organizations"],
    queryFn: listOrganizations,
    enabled: isOpen,
  })

  useEffect(() => {
    if (isOpen && !selectedOrgId && organizations.length > 0) {
      const currentOrgId = Cookies.get("tenant_id")
      if (currentOrgId && organizations.some((org: any) => org.id === currentOrgId)) {
        setSelectedOrgId(currentOrgId)
      } else {
        setSelectedOrgId(organizations[0]?.id || "")
      }
    }
  }, [isOpen, organizations, selectedOrgId])

  const mutation = useMutation({
    mutationFn: (payload: { email: string; organization_id: string }) =>
      createInvitation({
        email: payload.email,
        organization_id: payload.organization_id,
      }),
    onSuccess: () => {
      toast.success(`Invitation sent to ${email}`)
      setEmail("")
      if (selectedOrgId) {
        Cookies.set("tenant_id", selectedOrgId)
        setContextOrgId(selectedOrgId)
      }
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["memberships"] })
      queryClient.invalidateQueries({ queryKey: ["invitations"] })
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

    if (!selectedOrgId) {
      toast.error("Please select an organization")
      return
    }

    mutation.mutate({ email, organization_id: selectedOrgId })
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
            <Label htmlFor="organization">Organization</Label>
            <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org: any) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import Breadcrumb from "@/components/common/breadcrumb"
import InvitationsList from "@/components/invitations/invitations-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInvitation } from "@/services/invitation.service"
import { getApiErrorMessage } from "@/lib/api/errors"
import { Mail, Send } from "lucide-react"

export default function InvitationsPage() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [showForm, setShowForm] = useState(false)

  const inviteMutation = useMutation({
    mutationFn: (data: any) => createInvitation(data),
    onSuccess: () => {
      toast.success("Invitation sent successfully!")
      setEmail("")
      setRole("member")
      setShowForm(false)
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to send invitation"))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter an email address")
      return
    }
    inviteMutation.mutate({
      email,
      role,
    } as any)
  }

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Invitations" }]} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Invitations</h1>
          <p className="mt-1 text-muted-foreground">Manage member invitations for your organization</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="lg" className="gap-2 self-start sm:self-auto">
          <Send className="h-4 w-4" />
          {showForm ? "Cancel" : "Send Invitation"}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Send New Invitation</CardTitle>
            <CardDescription>
              Invite a new member to join your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={inviteMutation.isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={setRole} disabled={inviteMutation.isPending}>
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={inviteMutation.isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={inviteMutation.isPending} className="gap-2">
                  {inviteMutation.isPending ? "Sending..." : "Send Invitation"}
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending & Accepted Invitations
          </h2>
        </div>
        <InvitationsList />
      </div>
    </div>
  )
}

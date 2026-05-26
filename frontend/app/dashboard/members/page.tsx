"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import Breadcrumb from "@/components/common/breadcrumb"
import MembersTable from "@/components/members/members-table"
import InviteMemberModal from "@/components/members/invite-member-modal"
import { Button } from "@/components/ui/button"

export default function MembersPage() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Members" }]} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Members</h1>
          <p className="mt-1 text-muted-foreground">Manage your organization members and their roles</p>
        </div>
        <Button onClick={() => setInviteModalOpen(true)} className="self-start sm:self-auto">
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>
      <MembersTable key={refreshTrigger} />
      <InviteMemberModal
        isOpen={inviteModalOpen}
        onOpenChange={setInviteModalOpen}
      />
    </div>
  )
}

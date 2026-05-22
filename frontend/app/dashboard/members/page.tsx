"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import MembersTable from "@/components/members/members-table"
import InviteMemberModal from "@/components/members/invite-member-modal"
import { Button } from "@/components/ui/button"

export default function MembersPage() {
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Members</h1>
        <Button onClick={() => setInviteModalOpen(true)}>
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
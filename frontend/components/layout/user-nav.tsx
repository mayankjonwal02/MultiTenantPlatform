"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

import { useAuthStore } from "@/store/auth.store"
import { logoutUser } from "@/services/auth.service"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function UserNav() {
  const router = useRouter()
  const { refreshToken, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      if (refreshToken) {
        await logoutUser(refreshToken)
      }
    } catch {
      // Ignore logout API errors
    } finally {
      logout()
      router.push("/login")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
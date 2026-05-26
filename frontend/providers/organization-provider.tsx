"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"

interface OrganizationContextType {
  selectedOrgId: string | null
  setSelectedOrgId: (orgId: string) => void
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize from cookie if available
    const getCookieValue = (name: string) => {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(";").shift()
      return null
    }

    const initialOrgId = getCookieValue("tenant_id")
    if (initialOrgId) {
      setSelectedOrgId(initialOrgId)
    }
  }, [])

  const handleSetSelectedOrgId = useCallback((orgId: string) => {
    setSelectedOrgId(orgId)
  }, [])

  return (
    <OrganizationContext.Provider
      value={{
        selectedOrgId,
        setSelectedOrgId: handleSetSelectedOrgId,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error("useOrganization must be used within OrganizationProvider")
  }
  return context
}

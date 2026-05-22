"use client"

import { useEffect, useState } from "react"
import { getMemberships } from "@/services/membership.service"
import { Membership } from "@/types/membership"
import { getApiErrorMessage } from "@/lib/api/errors"

export function useMemberOrganizations() {
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        setLoading(true)
        const result = await getMemberships(1)
        setMemberships(result.results)
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Failed to fetch memberships"))
      } finally {
        setLoading(false)
      }
    }
    fetchMemberships()
  }, [])

  return { memberships, loading, error }
}

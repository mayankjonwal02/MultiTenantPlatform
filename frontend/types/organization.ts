export interface Organization {
  id: string
  name: string
  slug: string
  logo?: string
  subscription_plan?: string
  created_at?: string
  owner_id?: string
  owner_name?: string
  owner_email?: string
  member_count?: number
  is_owner?: boolean
}

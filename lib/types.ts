// Profile type definition
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  provider: string | null
  created_at: string
  updated_at: string
}

export interface UserWithProfile {
  id: string
  email?: string
  full_name?: string | null
  avatar_url?: string | null
  provider?: string | null
}

export type ProfileUpdateData = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>

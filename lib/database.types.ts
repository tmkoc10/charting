export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          username: string | null
          bio: string | null
          website: string | null
          location: string | null
          provider: string | null
          provider_id: string | null
          metadata: Json

          // Enhanced security fields
          role: string
          account_status: string
          mfa_enabled: boolean
          last_login_at: string | null
          last_login_ip: string | null
          failed_login_attempts: number
          account_locked_until: string | null
          password_changed_at: string
          terms_accepted_at: string | null
          privacy_policy_accepted_at: string | null

          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          provider?: string | null
          provider_id?: string | null
          metadata?: Json

          // Enhanced security fields
          role?: string
          account_status?: string
          mfa_enabled?: boolean
          last_login_at?: string | null
          last_login_ip?: string | null
          failed_login_attempts?: number
          account_locked_until?: string | null
          password_changed_at?: string
          terms_accepted_at?: string | null
          privacy_policy_accepted_at?: string | null

          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          username?: string | null
          bio?: string | null
          website?: string | null
          location?: string | null
          provider?: string | null
          provider_id?: string | null
          metadata?: Json

          // Enhanced security fields
          role?: string
          account_status?: string
          mfa_enabled?: boolean
          last_login_at?: string | null
          last_login_ip?: string | null
          failed_login_attempts?: number
          account_locked_until?: string | null
          password_changed_at?: string
          terms_accepted_at?: string | null
          privacy_policy_accepted_at?: string | null

          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

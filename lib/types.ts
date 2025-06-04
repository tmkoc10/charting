// Enhanced Profile type definition with security fields
export interface Profile {
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
  metadata: Record<string, unknown>

  // Enhanced security fields
  role: 'user' | 'admin' | 'trader' | 'analyst'
  account_status: 'active' | 'suspended' | 'locked' | 'pending_verification'
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

export interface UserWithProfile {
  id: string
  email?: string
  full_name?: string | null
  avatar_url?: string | null
  username?: string | null
  provider?: string | null
  role?: 'user' | 'admin' | 'trader' | 'analyst'
  account_status?: 'active' | 'suspended' | 'locked' | 'pending_verification'
  mfa_enabled?: boolean
  last_login_at?: string | null
  failed_login_attempts?: number
}

export type ProfileUpdateData = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at' | 'failed_login_attempts' | 'account_locked_until'>>

// Security-related types
export interface AuthAttempt {
  id: number
  ip: string
  email: string | null
  user_id: string | null
  attempt_type: 'login' | 'signup' | 'password_reset' | 'mfa_verify'
  success: boolean
  failure_reason: string | null
  user_agent: string | null
  attempted_at: string
  geolocation: Record<string, unknown>
  device_fingerprint: string | null
  risk_score: number
}

export interface SecurityAuditLog {
  id: number
  event_type: string
  user_id: string | null
  ip_address: string | null
  user_agent: string | null
  session_id: string | null
  event_data: Record<string, unknown>
  severity: 'low' | 'info' | 'warning' | 'high' | 'critical'
  endpoint: string | null
  request_method: string | null
  response_status: number | null
  processing_time_ms: number | null
  country_code: string | null
  city: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  created_at: string
}

export interface UserSession {
  id: string
  user_id: string
  session_token: string
  refresh_token: string | null
  ip_address: string | null
  user_agent: string | null
  device_fingerprint: string | null
  created_at: string
  last_accessed_at: string
  expires_at: string
  is_active: boolean
  is_suspicious: boolean
  force_logout: boolean
  country_code: string | null
  city: string | null
}

export interface SecurityConfig {
  key: string
  value: Record<string, unknown>
  description: string | null
  category: string
  updated_at: string
  updated_by: string | null
}

export interface MFAVerification {
  id: number
  user_id: string
  verification_method: 'totp' | 'sms' | 'email' | 'backup_code'
  verified_at: string
  ip_address: string | null
  user_agent: string | null
  session_id: string | null
  verification_context: string | null
  success: boolean
  failure_reason: string | null
  device_fingerprint: string | null
  geolocation: Record<string, unknown>
}

// Authentication response types
export interface AuthResponse {
  user: UserWithProfile | null
  error: Error | null
  session?: unknown
}

export interface SessionValidationResult {
  valid: boolean
  user_id?: string
  session_id?: string
  refreshed?: boolean
  expires_at?: string
  new_expires_at?: string
  reason?: string
}

// Rate limiting types
export interface RateLimit {
  id: number
  ip: string
  endpoint: string | null
  request_method: string | null
  user_id: string | null
  request_at: string
  user_agent: string | null
  request_headers: Record<string, unknown>
}

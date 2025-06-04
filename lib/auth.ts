import { createClient } from './client'
import { UserWithProfile, ProfileUpdateData, AuthResponse, SessionValidationResult } from './types'

// Define SecurityEvent interface for the security dashboard
interface SecurityEvent {
  id: string
  event_type: string
  severity: 'low' | 'info' | 'warning' | 'high' | 'critical'
  created_at: string
  ip_address?: string
  event_data: Record<string, unknown>
}

// Enhanced secure auth service with enterprise-grade security features
export const authService = {
  // Enhanced sign in with email and password with security features
  async signInWithEmail(email: string, password: string, clientInfo?: { ip?: string; userAgent?: string }): Promise<AuthResponse> {
    const supabase = createClient()
    const clientIp = clientInfo?.ip || '127.0.0.1'
    const userAgent = clientInfo?.userAgent || 'Unknown'

    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        throw new Error('Invalid email format')
      }

      // Check rate limiting before attempting authentication
      const { data: rateLimitCheck } = await supabase.rpc('check_auth_rate_limit', {
        user_email: email,
        client_ip: clientIp
      })

      if (rateLimitCheck === false) {
        // Log the rate limit violation
        await supabase.rpc('log_auth_attempt', {
          attempt_email: email,
          attempt_ip: clientIp,
          attempt_type: 'login',
          is_success: false,
          failure_reason: 'rate_limit_exceeded',
          user_agent_string: userAgent
        })
        throw new Error('Too many authentication attempts. Please try again later.')
      }

      // Attempt authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Log failed authentication attempt
        await supabase.rpc('log_auth_attempt', {
          attempt_email: email,
          attempt_ip: clientIp,
          attempt_type: 'login',
          is_success: false,
          failure_reason: error.message,
          user_agent_string: userAgent
        })
        throw error
      }

      // Get the enhanced user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select(`
          *,
          role,
          account_status,
          mfa_enabled,
          last_login_at,
          failed_login_attempts,
          account_locked_until
        `)
        .eq('id', data.user?.id)
        .single()

      // Check account status
      if (profileData?.account_status === 'suspended') {
        await supabase.auth.signOut()
        throw new Error('Account has been suspended. Please contact support.')
      }

      if (profileData?.account_status === 'locked') {
        await supabase.auth.signOut()
        throw new Error('Account is locked. Please contact support.')
      }

      // Check if account is temporarily locked
      if (profileData?.account_locked_until && new Date(profileData.account_locked_until) > new Date()) {
        await supabase.auth.signOut()
        throw new Error('Account is temporarily locked due to failed login attempts. Please try again later.')
      }

      // Update last login information
      await supabase
        .from('profiles')
        .update({
          last_login_at: new Date().toISOString(),
          last_login_ip: clientIp,
          failed_login_attempts: 0,
          account_locked_until: null
        })
        .eq('id', data.user.id)

      // Log successful authentication
      await supabase.rpc('log_auth_attempt', {
        attempt_email: email,
        attempt_ip: clientIp,
        attempt_type: 'login',
        is_success: true,
        failure_reason: null,
        user_agent_string: userAgent
      })

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          full_name: profileData?.full_name || null,
          avatar_url: profileData?.avatar_url || null,
          username: profileData?.username || null,
          provider: profileData?.provider || 'email',
          role: profileData?.role || 'user',
          account_status: profileData?.account_status || 'active',
          mfa_enabled: profileData?.mfa_enabled || false,
          last_login_at: profileData?.last_login_at || null,
          failed_login_attempts: profileData?.failed_login_attempts || 0,
        } : null,
        error: null,
        session: data.session
      }
    } catch (error) {
      console.error('Error signing in:', error)
      return { user: null, error: error as Error }
    }
  },

  // Enhanced sign up with email and password with security validation
  async signUpWithEmail(
    email: string,
    password: string,
    fullName?: string,
    clientInfo?: { ip?: string; userAgent?: string }
  ): Promise<AuthResponse> {
    const supabase = createClient()
    const clientIp = clientInfo?.ip || '127.0.0.1'
    const userAgent = clientInfo?.userAgent || 'Unknown'

    try {
      // Enhanced input validation
      if (!email || !password) {
        throw new Error('Email and password are required')
      }

      if (!email.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/)) {
        throw new Error('Invalid email format')
      }

      // Password strength validation
      if (password.length < 12) {
        throw new Error('Password must be at least 12 characters long')
      }

      if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
      }

      // Check rate limiting for signup attempts
      const { data: rateLimitCheck } = await supabase.rpc('check_auth_rate_limit', {
        user_email: email,
        client_ip: clientIp
      })

      if (rateLimitCheck === false) {
        await supabase.rpc('log_auth_attempt', {
          attempt_email: email,
          attempt_ip: clientIp,
          attempt_type: 'signup',
          is_success: false,
          failure_reason: 'rate_limit_exceeded',
          user_agent_string: userAgent
        })
        throw new Error('Too many signup attempts. Please try again later.')
      }

      // Attempt user registration
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
          },
        },
      })

      if (error) {
        // Log failed signup attempt
        await supabase.rpc('log_auth_attempt', {
          attempt_email: email,
          attempt_ip: clientIp,
          attempt_type: 'signup',
          is_success: false,
          failure_reason: error.message,
          user_agent_string: userAgent
        })
        throw error
      }

      // Log successful signup
      await supabase.rpc('log_auth_attempt', {
        attempt_email: email,
        attempt_ip: clientIp,
        attempt_type: 'signup',
        is_success: true,
        failure_reason: null,
        user_agent_string: userAgent
      })

      // The profile will be created by the database trigger with enhanced security fields
      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || null,
          provider: 'email',
          role: 'user',
          account_status: data.user.email_confirmed_at ? 'active' : 'pending_verification',
          mfa_enabled: false,
          failed_login_attempts: 0,
        } : null,
        error: null,
        session: data.session
      }
    } catch (error) {
      console.error('Error signing up:', error)
      return { user: null, error: error as Error }
    }
  },

  // Sign in with OAuth provider
  async signInWithOAuth(provider: 'github' | 'google', redirectTo?: string): Promise<{ error: Error | null }> {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || `${window.location.origin}/auth/callback?next=/charts`,
        },
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      return { error: error as Error }
    }
  },

  // Sign out the user
  async signOut(): Promise<{ error: Error | null }> {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error: error as Error }
    }
  },

  // Enhanced get current user with security information
  async getCurrentUser(): Promise<{ user: UserWithProfile | null; error: Error | null }> {
    const supabase = createClient()
    try {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) throw error

      if (!user) {
        return { user: null, error: null }
      }

      // Get the enhanced user profile with security fields
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          *,
          role,
          account_status,
          mfa_enabled,
          last_login_at,
          failed_login_attempts,
          account_locked_until
        `)
        .eq('id', user.id)
        .single()

      // Check if account is locked or suspended
      if (profile?.account_status === 'suspended' || profile?.account_status === 'locked') {
        await supabase.auth.signOut()
        throw new Error('Account access has been restricted. Please contact support.')
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: profile?.full_name || null,
          avatar_url: profile?.avatar_url || null,
          username: profile?.username || null,
          provider: profile?.provider || 'email',
          role: profile?.role || 'user',
          account_status: profile?.account_status || 'active',
          mfa_enabled: profile?.mfa_enabled || false,
          last_login_at: profile?.last_login_at || null,
          failed_login_attempts: profile?.failed_login_attempts || 0,
        },
        error: null,
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { user: null, error: error as Error }
    }
  },

  // Enable MFA for current user
  async enableMFA(): Promise<{ error: Error | null; success: boolean }> {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase.rpc('enable_user_mfa', {
        user_uuid: user.id
      })

      if (error) throw error

      return { error: null, success: true }
    } catch (error) {
      console.error('Error enabling MFA:', error)
      return { error: error as Error, success: false }
    }
  },

  // Check if user requires MFA
  async checkMFARequirement(): Promise<{ required: boolean; error: Error | null }> {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase.rpc('user_requires_mfa', {
        user_uuid: user.id
      })

      if (error) throw error

      return { required: data || false, error: null }
    } catch (error) {
      console.error('Error checking MFA requirement:', error)
      return { required: false, error: error as Error }
    }
  },

  // Validate current session
  async validateSession(): Promise<SessionValidationResult> {
    const supabase = createClient()
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) throw error

      if (!session) {
        return { valid: false, reason: 'no_session' }
      }

      // Check if session is close to expiry and needs refresh
      const expiresAt = new Date(session.expires_at! * 1000)
      const now = new Date()
      const timeUntilExpiry = expiresAt.getTime() - now.getTime()
      const oneHour = 60 * 60 * 1000

      if (timeUntilExpiry < oneHour) {
        // Attempt to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

        if (refreshError) {
          return { valid: false, reason: 'refresh_failed' }
        }

        return {
          valid: true,
          user_id: refreshData.user?.id,
          refreshed: true,
          expires_at: refreshData.session?.expires_at
            ? new Date(refreshData.session.expires_at * 1000).toISOString()
            : new Date().toISOString()
        }
      }

      return {
        valid: true,
        user_id: session.user.id,
        refreshed: false,
        expires_at: expiresAt.toISOString()
      }
    } catch (error) {
      console.error('Error validating session:', error)
      return { valid: false, reason: 'validation_error' }
    }
  },

  // Force logout all sessions (security feature)
  async forceLogoutAllSessions(): Promise<{ error: Error | null; success: boolean }> {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Sign out from current session
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // Mark all user sessions as force logout in our tracking table
      await supabase
        .from('user_sessions')
        .update({ force_logout: true, is_active: false })
        .eq('user_id', user.id)

      return { error: null, success: true }
    } catch (error) {
      console.error('Error forcing logout:', error)
      return { error: error as Error, success: false }
    }
  },

  // Get user's security audit log
  async getSecurityAuditLog(): Promise<{ logs: SecurityEvent[] | null; error: Error | null }> {
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Note: This would require a secure function to access private.security_audit_log
      // For now, we'll return a placeholder
      return { logs: [], error: null }
    } catch (error) {
      console.error('Error getting security audit log:', error)
      return { logs: null, error: error as Error }
    }
  },

  // Update the user's profile
  async updateProfile(userId: string, profileData: ProfileUpdateData): Promise<{ error: Error | null }> {
    const supabase = createClient()
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error: error as Error }
    }
  }
}

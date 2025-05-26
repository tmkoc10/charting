import { createClient } from './client'
import { UserWithProfile, ProfileUpdateData } from './types'

// Create a secure auth service to abstract authentication logic
export const authService = {
  // Sign in with email and password
  async signInWithEmail(email: string, password: string): Promise<{ error: Error | null; user: UserWithProfile | null }> {
    const supabase = createClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get the user profile data
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user?.id)
        .single()

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          full_name: profileData?.full_name || null,
          avatar_url: profileData?.avatar_url || null,
          provider: profileData?.provider || 'email',
        } : null,
        error: null,
      }
    } catch (error) {
      console.error('Error signing in:', error)
      return { user: null, error: error as Error }
    }
  },

  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, fullName?: string): Promise<{ error: Error | null; user: UserWithProfile | null }> {
    const supabase = createClient()
    try {
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || null,
          },
        },
      })

      if (error) throw error

      // The profile will be created by the database trigger
      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || null,
          provider: 'email',
        } : null,
        error: null,
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

  // Get the current user and their profile
  async getCurrentUser(): Promise<{ user: UserWithProfile | null; error: Error | null }> {
    const supabase = createClient()
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      if (!user) {
        return { user: null, error: null }
      }

      // Get the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: profile?.full_name || null,
          avatar_url: profile?.avatar_url || null,
          provider: profile?.provider || 'email',
        },
        error: null,
      }
    } catch (error) {
      console.error('Error getting current user:', error)
      return { user: null, error: error as Error }
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

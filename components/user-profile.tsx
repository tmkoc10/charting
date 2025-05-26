'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserWithProfile } from '@/lib/types'

export function UserProfile() {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadUserProfile = async () => {
      setIsLoading(true)
      try {
        const { user, error } = await authService.getCurrentUser()
        if (error) throw error
        setUser(user)
        if (user?.full_name) {
          setFullName(user.full_name)
        }
      } catch (error) {
        console.error('Error loading user profile:', error)
        setError('Failed to load user profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadUserProfile()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    setIsSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await authService.updateProfile(user.id, {
        full_name: fullName
      })
      
      if (error) throw error
      
      setSuccess('Profile updated successfully')
      
      // Refresh the user data
      const { user: updatedUser, error: getUserError } = await authService.getCurrentUser()
      if (getUserError) throw getUserError
      setUser(updatedUser)
      
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await authService.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="border-gray-700 bg-black text-white">
        <CardHeader>
          <CardTitle>Not Authenticated</CardTitle>
          <CardDescription>You need to sign in to view your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => router.push('/auth/login')}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-700 bg-black text-white">
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>View and edit your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user.email || ''}
              disabled
              className="bg-gray-900 border-gray-700 text-white"
            />
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Authentication Provider</Label>
            <div className="py-2 px-3 bg-gray-900 border border-gray-700 rounded-md text-white">
              {user.provider === 'email' ? 'Email & Password' : 
               user.provider ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) : 'Unknown'}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="flex-1 bg-white text-black hover:bg-gray-200"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSignOut}
              className="flex-1 border-gray-700 text-white hover:bg-gray-800"
            >
              Sign Out
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

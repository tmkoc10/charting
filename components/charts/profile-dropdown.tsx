'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth'
import { UserWithProfile } from '@/lib/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { User, LogOut, Settings, Bell, Shield, HelpCircle, Palette } from 'lucide-react'

// Helper function to get user initials
const getUserInitials = (user: UserWithProfile): string => {
  if (user.full_name) {
    return user.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return 'U';
};

export function ProfileDropdown() {
  const [user, setUser] = useState<UserWithProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true)
      try {
        const { user, error } = await authService.getCurrentUser()
        if (error) throw error
        setUser(user)
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

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
      <div className="flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
          <div className="w-4 h-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth/login')}
        className="w-8 h-8 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-colors duration-200"
        title="Sign In"
      >
        <User size={16} className="text-zinc-300" />
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-200 hover:scale-105 outline-none ring-0 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
        {getUserInitials(user)}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[220px] bg-black border border-gray-700 text-white p-1 ml-4"
        align="start"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="px-4 py-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              {getUserInitials(user)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user.full_name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 hover:bg-gray-800 transition-colors"
          onClick={() => router.push('/profile')}
        >
          <User size={16} className="text-gray-400" />
          <span>View Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 hover:bg-gray-800 transition-colors"
          onClick={() => router.push('/profile')}
        >
          <Settings size={16} className="text-gray-400" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 hover:bg-gray-800 transition-colors"
          onClick={() => {/* TODO: Implement notifications */}}
        >
          <Bell size={16} className="text-gray-400" />
          <span>Notifications</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 hover:bg-gray-800 transition-colors"
          onClick={() => {/* TODO: Implement preferences */}}
        >
          <Palette size={16} className="text-gray-400" />
          <span>Preferences</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700 my-1" />

        {/* Help & Support */}
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 hover:bg-gray-800 transition-colors"
          onClick={() => {/* TODO: Implement help */}}
        >
          <HelpCircle size={16} className="text-gray-400" />
          <span>Help & Support</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 hover:bg-gray-800 transition-colors"
          onClick={() => {/* TODO: Implement security */}}
        >
          <Shield size={16} className="text-gray-400" />
          <span>Security</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700 my-1" />

        {/* Sign Out */}
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 py-2.5 px-4 text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          onClick={handleSignOut}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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
import { User, LogOut, Settings, ChevronDown } from 'lucide-react'

// Helper function to get user initials
// const getUserInitials = (user: UserWithProfile): string => {
//   if (user.full_name) {
//     return user.full_name
//       .split(' ')
//       .map(name => name.charAt(0))
//       .join('')
//       .toUpperCase()
//       .slice(0, 2);
//   }
//   if (user.email) {
//     return user.email.charAt(0).toUpperCase();
//   }
//   return 'U';
// };

// Helper function to get user display name
// const getUserDisplayName = (user: UserWithProfile): string => {
//   return user.full_name || user.email?.split('@')[0] || 'User';
// };

export function UserAccountDropdown() {
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
        className="flex items-center gap-2 py-1 px-2 text-sm text-white hover:bg-gray-800 rounded"
      >
        <User size={16} />
        <span>Sign In</span>
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 py-1 px-2 text-sm text-white hover:bg-gray-800 rounded outline-none">
        <User size={16} />
        <span className="max-w-[120px] truncate">
          {user.full_name || user.email?.split('@')[0] || 'User'}
        </span>
        <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[200px] bg-black border border-gray-700 text-white p-1">
        <div className="px-4 py-2">
          <p className="font-medium">{user.full_name || 'User'}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-gray-700 my-1" />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 py-2 hover:bg-gray-800"
          onClick={() => router.push('/profile')}
        >
          <Settings size={16} />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700 my-1" />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 py-2 text-red-400 hover:bg-gray-800"
          onClick={handleSignOut}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

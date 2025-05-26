"use client"

import { UserProfile } from "@/components/user-profile"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      <div className="flex-1 max-w-4xl mx-auto p-6 md:p-10">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        <UserProfile />
      </div>
    </div>
  )
}

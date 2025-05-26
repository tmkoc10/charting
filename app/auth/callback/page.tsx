'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Disable static generation for this page
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function CallbackPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const next = searchParams?.get('next') || '/charts'
    const handleConfirmation = async () => {
      const supabase = createClient()
      setIsLoading(true)
      setError(null)

      try {
        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        if (!session) {
          setError('No session found. Please try logging in again.')
          return
        }
        
        // Redirect to the specified page
        router.push(next)
      } catch (error) {
        console.error('Confirmation error:', error)
        setError(error instanceof Error ? error.message : 'An error occurred during confirmation')
      } finally {
        setIsLoading(false)
      }
    }

    handleConfirmation()
  }, [router, searchParams])

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-black text-white">
      <Card className="w-full max-w-sm border-gray-700 bg-black">
        <CardHeader>
          <CardTitle className="text-2xl">Confirming your authentication</CardTitle>
          <CardDescription>Please wait while we confirm your authentication</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 py-4">
              <p>{error}</p>
              <button
                onClick={() => router.push('/auth/login')}
                className="mt-4 w-full rounded bg-white px-4 py-2 text-center text-sm font-medium text-black hover:bg-gray-200"
              >
                Back to Login
              </button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

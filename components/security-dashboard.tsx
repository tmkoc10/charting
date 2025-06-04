'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Users, Activity } from 'lucide-react'
import { authService } from '@/lib/auth'

interface SecurityEvent {
  id: string
  event_type: string
  severity: 'low' | 'info' | 'warning' | 'high' | 'critical'
  created_at: string
  ip_address?: string
  event_data: Record<string, unknown>
}

interface SecurityStats {
  totalLogins: number
  failedAttempts: number
  suspiciousActivity: number
  mfaEnabled: boolean
  lastLogin: string | null
  accountStatus: string
}

export function SecurityDashboard() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { user: currentUser, error: userError } = await authService.getCurrentUser()
      if (userError) throw userError
      if (!currentUser) throw new Error('User not authenticated')

      // Load security audit log (placeholder for now)
      const { logs, error: logsError } = await authService.getSecurityAuditLog()
      if (logsError) {
        console.warn('Could not load security logs:', logsError)
      } else {
        setSecurityEvents(logs || [])
      }

      // Calculate security stats
      const stats: SecurityStats = {
        totalLogins: 0, // Would be calculated from audit logs
        failedAttempts: currentUser.failed_login_attempts || 0,
        suspiciousActivity: 0, // Would be calculated from audit logs
        mfaEnabled: currentUser.mfa_enabled || false,
        lastLogin: currentUser.last_login_at || null,
        accountStatus: currentUser.account_status || 'active'
      }

      setSecurityStats(stats)
    } catch (error) {
      console.error('Error loading security data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load security data')
    } finally {
      setLoading(false)
    }
  }

  const handleEnableMFA = async () => {
    try {
      const { success, error } = await authService.enableMFA()
      if (error) throw error
      if (success) {
        // Reload security data to reflect MFA status
        await loadSecurityData()
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to enable MFA')
    }
  }

  const handleForceLogoutAllSessions = async () => {
    try {
      const { success, error } = await authService.forceLogoutAllSessions()
      if (error) throw error
      if (success) {
        // This will log out the user, so redirect to login
        window.location.href = '/auth/login'
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to logout all sessions')
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'warning': return 'secondary'
      case 'info': return 'default'
      case 'low': return 'outline'
      default: return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'suspended': return <XCircle className="h-4 w-4 text-red-500" />
      case 'locked': return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending_verification': return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading security dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">Monitor your account security and activity</p>
        </div>
        <Shield className="h-8 w-8 text-primary" />
      </div>

      {/* Security Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Status</CardTitle>
            {getStatusIcon(securityStats?.accountStatus || 'unknown')}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {securityStats?.accountStatus || 'Unknown'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Status</CardTitle>
            {securityStats?.mfaEnabled ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityStats?.mfaEnabled ? 'Enabled' : 'Disabled'}
            </div>
            {!securityStats?.mfaEnabled && (
              <Button 
                size="sm" 
                className="mt-2"
                onClick={handleEnableMFA}
              >
                Enable MFA
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityStats?.failedAttempts || 0}
            </div>
            <p className="text-xs text-muted-foreground">Recent failed logins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Login</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {securityStats?.lastLogin 
                ? new Date(securityStats.lastLogin).toLocaleDateString()
                : 'Never'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {securityStats?.lastLogin 
                ? new Date(securityStats.lastLogin).toLocaleTimeString()
                : 'No login recorded'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Actions</CardTitle>
          <CardDescription>
            Manage your account security settings and perform security actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {!securityStats?.mfaEnabled && (
              <Button onClick={handleEnableMFA}>
                <Shield className="h-4 w-4 mr-2" />
                Enable Multi-Factor Authentication
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleForceLogoutAllSessions}
            >
              <Users className="h-4 w-4 mr-2" />
              Logout All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
          <CardDescription>
            Monitor recent authentication and security events for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {securityEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No security events recorded yet
            </p>
          ) : (
            <div className="space-y-2">
              {securityEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Badge variant={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <div>
                      <p className="font-medium">{event.event_type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.ip_address && `From ${event.ip_address}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

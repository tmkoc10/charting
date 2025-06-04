-- Security Infrastructure Migration
-- This migration adds enterprise-grade security features for the algorithmic trading platform

-- =====================================================
-- 1. RATE LIMITING INFRASTRUCTURE
-- =====================================================

-- Create private schema for internal security tables
CREATE SCHEMA IF NOT EXISTS private;

-- Rate limiting table for API requests
CREATE TABLE IF NOT EXISTS private.rate_limits (
  id BIGSERIAL PRIMARY KEY,
  ip INET NOT NULL,
  endpoint TEXT,
  request_method TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  request_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  request_headers JSONB DEFAULT '{}',
  
  -- Indexes for fast lookups
  CONSTRAINT rate_limits_ip_check CHECK (ip IS NOT NULL)
);

-- Create indexes for optimal rate limiting performance
CREATE INDEX IF NOT EXISTS rate_limits_ip_request_at_idx ON private.rate_limits (ip, request_at DESC);
CREATE INDEX IF NOT EXISTS rate_limits_user_request_at_idx ON private.rate_limits (user_id, request_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS rate_limits_endpoint_idx ON private.rate_limits (endpoint, request_at DESC) WHERE endpoint IS NOT NULL;

-- Authentication attempt tracking
CREATE TABLE IF NOT EXISTS private.auth_attempts (
  id BIGSERIAL PRIMARY KEY,
  ip INET NOT NULL,
  email TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('login', 'signup', 'password_reset', 'mfa_verify')),
  success BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason TEXT,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  
  -- Additional security context
  geolocation JSONB DEFAULT '{}',
  device_fingerprint TEXT,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100)
);

-- Indexes for auth attempt analysis
CREATE INDEX IF NOT EXISTS auth_attempts_ip_attempted_at_idx ON private.auth_attempts (ip, attempted_at DESC);
CREATE INDEX IF NOT EXISTS auth_attempts_email_attempted_at_idx ON private.auth_attempts (email, attempted_at DESC) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS auth_attempts_user_attempted_at_idx ON private.auth_attempts (user_id, attempted_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS auth_attempts_success_idx ON private.auth_attempts (success, attempted_at DESC);

-- Password verification attempts (for Supabase auth hooks)
CREATE TABLE IF NOT EXISTS private.password_failed_verification_attempts (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  failed_attempts INTEGER DEFAULT 0,
  last_failed_at TIMESTAMP WITH TIME ZONE,
  locked_until TIMESTAMP WITH TIME ZONE,
  
  -- Track consecutive failures
  consecutive_failures INTEGER DEFAULT 0,
  first_failure_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. AUDIT LOGGING SYSTEM
-- =====================================================

-- Comprehensive audit log for all security events
CREATE TABLE IF NOT EXISTS private.security_audit_log (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'user_login', 'user_logout', 'user_signup', 'password_change', 'password_reset',
    'mfa_enabled', 'mfa_disabled', 'mfa_verified', 'account_locked', 'account_unlocked',
    'profile_updated', 'role_changed', 'suspicious_activity', 'data_access', 'api_access'
  )),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Event details
  event_data JSONB DEFAULT '{}',
  severity TEXT DEFAULT 'info' CHECK (severity IN ('low', 'info', 'warning', 'high', 'critical')),
  
  -- Context information
  endpoint TEXT,
  request_method TEXT,
  response_status INTEGER,
  processing_time_ms INTEGER,
  
  -- Geolocation and device info
  country_code TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for audit log queries
CREATE INDEX IF NOT EXISTS security_audit_log_user_created_at_idx ON private.security_audit_log (user_id, created_at DESC) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS security_audit_log_event_type_idx ON private.security_audit_log (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS security_audit_log_severity_idx ON private.security_audit_log (severity, created_at DESC);
CREATE INDEX IF NOT EXISTS security_audit_log_ip_idx ON private.security_audit_log (ip_address, created_at DESC) WHERE ip_address IS NOT NULL;

-- =====================================================
-- 3. SESSION MANAGEMENT TABLES
-- =====================================================

-- Enhanced session tracking
CREATE TABLE IF NOT EXISTS private.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  refresh_token TEXT UNIQUE,
  
  -- Session metadata
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  
  -- Session lifecycle
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Security flags
  is_active BOOLEAN DEFAULT TRUE,
  is_suspicious BOOLEAN DEFAULT FALSE,
  force_logout BOOLEAN DEFAULT FALSE,
  
  -- Geolocation
  country_code TEXT,
  city TEXT,
  
  CONSTRAINT user_sessions_expires_check CHECK (expires_at > created_at)
);

-- Indexes for session management
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON private.user_sessions (user_id, last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS user_sessions_token_idx ON private.user_sessions (session_token) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS user_sessions_expires_idx ON private.user_sessions (expires_at) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS user_sessions_suspicious_idx ON private.user_sessions (is_suspicious, created_at DESC) WHERE is_suspicious = TRUE;

-- =====================================================
-- 4. SECURITY CONFIGURATION TABLE
-- =====================================================

-- System-wide security settings
CREATE TABLE IF NOT EXISTS private.security_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Insert default security configuration
INSERT INTO private.security_config (key, value, description, category) VALUES
  ('rate_limit_requests_per_minute', '100', 'Maximum requests per minute per IP', 'rate_limiting'),
  ('rate_limit_auth_attempts_per_hour', '10', 'Maximum authentication attempts per hour per IP', 'rate_limiting'),
  ('max_failed_login_attempts', '5', 'Maximum failed login attempts before account lockout', 'authentication'),
  ('account_lockout_duration_minutes', '30', 'Duration of account lockout in minutes', 'authentication'),
  ('session_timeout_minutes', '480', 'Session timeout in minutes (8 hours)', 'session_management'),
  ('session_refresh_threshold_minutes', '60', 'Time before expiry to allow refresh', 'session_management'),
  ('max_concurrent_sessions', '5', 'Maximum concurrent sessions per user', 'session_management'),
  ('password_min_length', '12', 'Minimum password length', 'password_policy'),
  ('password_require_special_chars', 'true', 'Require special characters in password', 'password_policy'),
  ('mfa_enforcement_for_roles', '["admin", "trader"]', 'Roles that require MFA', 'mfa'),
  ('suspicious_activity_threshold', '75', 'Risk score threshold for suspicious activity', 'monitoring')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant necessary permissions to supabase_auth_admin for auth hooks
GRANT ALL ON TABLE private.password_failed_verification_attempts TO supabase_auth_admin;
GRANT ALL ON TABLE private.auth_attempts TO supabase_auth_admin;
GRANT ALL ON TABLE private.security_audit_log TO supabase_auth_admin;

-- Revoke access from public roles
REVOKE ALL ON SCHEMA private FROM authenticated, anon, public;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM authenticated, anon, public;

-- Grant limited access to service_role for system operations
GRANT USAGE ON SCHEMA private TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA private TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA private TO service_role;

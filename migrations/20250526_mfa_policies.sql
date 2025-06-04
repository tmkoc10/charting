-- MFA (Multi-Factor Authentication) Policies Migration
-- Enterprise-grade MFA enforcement for algorithmic trading platform

-- =====================================================
-- 1. MFA ENFORCEMENT RLS POLICIES
-- =====================================================

-- Create restrictive policy to enforce MFA for sensitive operations
CREATE POLICY "Enforce MFA for profile updates"
  ON public.profiles
  AS RESTRICTIVE
  FOR UPDATE
  TO authenticated
  USING (
    -- Allow updates if user has completed MFA or if MFA is not required for their role
    (SELECT auth.jwt()->>'aal') = 'aal2'
    OR role NOT IN (
      SELECT jsonb_array_elements_text(value::jsonb) 
      FROM private.security_config 
      WHERE key = 'mfa_enforcement_for_roles'
    )
    OR mfa_enabled = FALSE  -- Allow users to enable MFA initially
  );

-- Create restrictive policy for trading-related data access (for future trading tables)
-- This is a template that can be applied to trading tables
CREATE OR REPLACE FUNCTION public.enforce_mfa_for_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  mfa_required_roles jsonb;
  user_aal text;
  user_mfa_enabled boolean;
BEGIN
  -- Get current user's role
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  
  -- Get MFA required roles from config
  SELECT value::jsonb INTO mfa_required_roles 
  FROM private.security_config 
  WHERE key = 'mfa_enforcement_for_roles';
  
  -- Get user's authentication assurance level
  user_aal := auth.jwt()->>'aal';
  
  -- Get user's MFA status
  SELECT mfa_enabled INTO user_mfa_enabled FROM public.profiles WHERE id = auth.uid();
  
  -- If user role requires MFA
  IF mfa_required_roles ? user_role THEN
    -- Check if user has completed MFA (aal2) or has MFA enabled
    RETURN user_aal = 'aal2' OR user_mfa_enabled = TRUE;
  END IF;
  
  -- If role doesn't require MFA, allow access
  RETURN TRUE;
END;
$$;

-- =====================================================
-- 2. MFA MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to enable MFA for a user
CREATE OR REPLACE FUNCTION public.enable_user_mfa(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow users to enable MFA for themselves or admins for any user
  IF auth.uid() != user_uuid AND NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Cannot enable MFA for other users';
  END IF;
  
  -- Update user profile
  UPDATE public.profiles 
  SET mfa_enabled = TRUE, updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Log MFA enablement
  INSERT INTO private.security_audit_log (
    event_type, user_id, severity, event_data
  ) VALUES (
    'mfa_enabled', user_uuid, 'info',
    jsonb_build_object(
      'enabled_by', auth.uid(),
      'timestamp', NOW()
    )
  );
  
  RETURN TRUE;
END;
$$;

-- Function to disable MFA for a user (admin only)
CREATE OR REPLACE FUNCTION public.disable_user_mfa(user_uuid uuid, admin_reason text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow admins to disable MFA
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can disable MFA';
  END IF;
  
  -- Update user profile
  UPDATE public.profiles 
  SET mfa_enabled = FALSE, updated_at = NOW()
  WHERE id = user_uuid;
  
  -- Log MFA disablement
  INSERT INTO private.security_audit_log (
    event_type, user_id, severity, event_data
  ) VALUES (
    'mfa_disabled', user_uuid, 'warning',
    jsonb_build_object(
      'disabled_by', auth.uid(),
      'reason', admin_reason,
      'timestamp', NOW()
    )
  );
  
  RETURN TRUE;
END;
$$;

-- Function to check if user requires MFA
CREATE OR REPLACE FUNCTION public.user_requires_mfa(user_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
  mfa_required_roles jsonb;
BEGIN
  -- Get user's role
  SELECT role INTO user_role FROM public.profiles WHERE id = user_uuid;
  
  -- Get MFA required roles from config
  SELECT value::jsonb INTO mfa_required_roles 
  FROM private.security_config 
  WHERE key = 'mfa_enforcement_for_roles';
  
  -- Check if user's role requires MFA
  RETURN mfa_required_roles ? user_role;
END;
$$;

-- =====================================================
-- 3. ENHANCED SECURITY POLICIES FOR TRADING DATA
-- =====================================================

-- Apply MFA enforcement to NSE equity symbols (trading data)
CREATE POLICY "MFA required for equity symbols modification"
  ON public.nse_equity_symbols
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    -- Allow read access without MFA, but require MFA for modifications
    TG_OP = 'SELECT' OR public.enforce_mfa_for_role()
  );

-- Apply MFA enforcement to NSE options (trading data)
CREATE POLICY "MFA required for options modification"
  ON public.nse_options
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    -- Allow read access without MFA, but require MFA for modifications
    TG_OP = 'SELECT' OR public.enforce_mfa_for_role()
  );

-- Apply MFA enforcement to NSE indices (trading data)
CREATE POLICY "MFA required for indices modification"
  ON public.nse_indices
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (
    -- Allow read access without MFA, but require MFA for modifications
    TG_OP = 'SELECT' OR public.enforce_mfa_for_role()
  );

-- =====================================================
-- 4. MFA VERIFICATION TRACKING
-- =====================================================

-- Table to track MFA verification events
CREATE TABLE IF NOT EXISTS private.mfa_verifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  verification_method TEXT NOT NULL CHECK (verification_method IN ('totp', 'sms', 'email', 'backup_code')),
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  session_id UUID,
  
  -- Verification context
  verification_context TEXT, -- What action triggered MFA
  success BOOLEAN DEFAULT TRUE,
  failure_reason TEXT,
  
  -- Security metadata
  device_fingerprint TEXT,
  geolocation JSONB DEFAULT '{}'
);

-- Index for MFA verification queries
CREATE INDEX IF NOT EXISTS mfa_verifications_user_verified_at_idx 
ON private.mfa_verifications (user_id, verified_at DESC);

CREATE INDEX IF NOT EXISTS mfa_verifications_session_idx 
ON private.mfa_verifications (session_id) WHERE session_id IS NOT NULL;

-- Function to log MFA verification
CREATE OR REPLACE FUNCTION public.log_mfa_verification(
  user_uuid uuid,
  method text,
  context_info text,
  client_ip inet DEFAULT NULL,
  user_agent_string text DEFAULT NULL,
  session_uuid uuid DEFAULT NULL,
  is_success boolean DEFAULT TRUE,
  failure_reason_text text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert MFA verification record
  INSERT INTO private.mfa_verifications (
    user_id, verification_method, verification_context, ip_address, 
    user_agent, session_id, success, failure_reason
  ) VALUES (
    user_uuid, method, context_info, client_ip, 
    user_agent_string, session_uuid, is_success, failure_reason_text
  );
  
  -- Log to security audit
  INSERT INTO private.security_audit_log (
    event_type, user_id, ip_address, severity, event_data
  ) VALUES (
    'mfa_verified', user_uuid, client_ip,
    CASE WHEN is_success THEN 'info' ELSE 'warning' END,
    jsonb_build_object(
      'method', method,
      'context', context_info,
      'success', is_success,
      'failure_reason', failure_reason_text,
      'session_id', session_uuid
    )
  );
END;
$$;

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant permissions for MFA functions
GRANT EXECUTE ON FUNCTION public.enforce_mfa_for_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.enable_user_mfa(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.disable_user_mfa(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_requires_mfa(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_mfa_verification(uuid, text, text, inet, text, uuid, boolean, text) TO authenticated;

-- Grant access to MFA tables for service role
GRANT ALL ON TABLE private.mfa_verifications TO service_role;
GRANT ALL ON SEQUENCE private.mfa_verifications_id_seq TO service_role;

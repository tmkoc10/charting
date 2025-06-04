-- Security Functions Migration
-- Enterprise-grade security functions for authentication and rate limiting

-- =====================================================
-- 1. RATE LIMITING FUNCTIONS
-- =====================================================

-- Main rate limiting function for API requests
CREATE OR REPLACE FUNCTION public.check_rate_limit()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  req_method text := current_setting('request.method', true);
  req_ip inet;
  req_path text := current_setting('request.path', true);
  count_in_window integer;
  rate_limit integer;
  time_window interval;
BEGIN
  -- Extract IP from headers (handle various proxy configurations)
  req_ip := COALESCE(
    split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1),
    split_part(current_setting('request.headers', true)::json->>'x-real-ip', ',', 1),
    current_setting('request.headers', true)::json->>'cf-connecting-ip'
  )::inet;

  -- Skip rate limiting for GET and HEAD requests (read-only)
  IF req_method IN ('GET', 'HEAD') OR req_method IS NULL THEN
    RETURN;
  END IF;

  -- Get rate limit configuration
  SELECT (value->>'rate_limit_requests_per_minute')::integer INTO rate_limit
  FROM private.security_config WHERE key = 'rate_limit_requests_per_minute';
  
  rate_limit := COALESCE(rate_limit, 100); -- Default fallback
  time_window := interval '1 minute';

  -- Count requests in the time window
  SELECT COUNT(*) INTO count_in_window
  FROM private.rate_limits
  WHERE ip = req_ip 
    AND request_at > NOW() - time_window;

  -- Check if rate limit exceeded
  IF count_in_window >= rate_limit THEN
    -- Log the rate limit violation
    INSERT INTO private.security_audit_log (
      event_type, ip_address, endpoint, request_method, severity, event_data
    ) VALUES (
      'api_access', req_ip, req_path, req_method, 'warning',
      jsonb_build_object('reason', 'rate_limit_exceeded', 'count', count_in_window, 'limit', rate_limit)
    );

    -- Raise rate limit error
    RAISE sqlstate 'PGRST' USING
      message = jsonb_build_object(
        'message', 'Rate limit exceeded. Please try again later.',
        'retry_after', 60
      )::text,
      detail = jsonb_build_object(
        'status', 429,
        'status_text', 'Too Many Requests'
      )::text;
  END IF;

  -- Log the request
  INSERT INTO private.rate_limits (ip, endpoint, request_method, request_at, user_agent)
  VALUES (
    req_ip, 
    req_path, 
    req_method, 
    NOW(),
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$;

-- Authentication rate limiting function
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(user_email text, client_ip inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempts_count integer;
  rate_limit integer;
  time_window interval := interval '1 hour';
BEGIN
  -- Get auth rate limit configuration
  SELECT (value->>'rate_limit_auth_attempts_per_hour')::integer INTO rate_limit
  FROM private.security_config WHERE key = 'rate_limit_auth_attempts_per_hour';
  
  rate_limit := COALESCE(rate_limit, 10); -- Default fallback

  -- Count failed authentication attempts in the time window
  SELECT COUNT(*) INTO attempts_count
  FROM private.auth_attempts
  WHERE (ip = client_ip OR email = user_email)
    AND success = FALSE
    AND attempted_at > NOW() - time_window;

  -- Return false if rate limit exceeded
  IF attempts_count >= rate_limit THEN
    -- Log the rate limit violation
    INSERT INTO private.security_audit_log (
      event_type, ip_address, severity, event_data
    ) VALUES (
      'suspicious_activity', client_ip, 'high',
      jsonb_build_object(
        'reason', 'auth_rate_limit_exceeded', 
        'email', user_email,
        'attempts_count', attempts_count,
        'limit', rate_limit
      )
    );
    
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$;

-- =====================================================
-- 2. AUTHENTICATION SECURITY FUNCTIONS
-- =====================================================

-- Password verification hook for Supabase Auth
CREATE OR REPLACE FUNCTION public.hook_password_verification_attempt(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_uuid uuid;
  last_failed_at timestamp;
  failed_count integer;
  lockout_duration interval;
  max_attempts integer;
BEGIN
  user_uuid := (event->>'user_id')::uuid;
  
  -- Get security configuration
  SELECT (value->>'max_failed_login_attempts')::integer INTO max_attempts
  FROM private.security_config WHERE key = 'max_failed_login_attempts';
  
  SELECT (value->>'account_lockout_duration_minutes')::integer * interval '1 minute' INTO lockout_duration
  FROM private.security_config WHERE key = 'account_lockout_duration_minutes';
  
  max_attempts := COALESCE(max_attempts, 5);
  lockout_duration := COALESCE(lockout_duration, interval '30 minutes');

  -- If password is valid, clear failed attempts
  IF (event->>'valid')::boolean = true THEN
    DELETE FROM private.password_failed_verification_attempts WHERE user_id = user_uuid;
    
    -- Update profile with successful login
    UPDATE public.profiles 
    SET 
      failed_login_attempts = 0,
      last_login_at = NOW(),
      account_locked_until = NULL
    WHERE id = user_uuid;
    
    -- Log successful authentication
    INSERT INTO private.security_audit_log (
      event_type, user_id, severity, event_data
    ) VALUES (
      'user_login', user_uuid, 'info',
      jsonb_build_object('method', 'password', 'success', true)
    );
    
    RETURN jsonb_build_object('decision', 'continue');
  END IF;

  -- Handle failed password attempt
  SELECT last_failed_at, failed_attempts INTO last_failed_at, failed_count
  FROM private.password_failed_verification_attempts
  WHERE user_id = user_uuid;

  -- Check if user is currently locked out
  IF last_failed_at IS NOT NULL AND NOW() - last_failed_at < lockout_duration THEN
    -- Log lockout attempt
    INSERT INTO private.security_audit_log (
      event_type, user_id, severity, event_data
    ) VALUES (
      'suspicious_activity', user_uuid, 'warning',
      jsonb_build_object(
        'reason', 'login_attempt_during_lockout',
        'locked_until', last_failed_at + lockout_duration
      )
    );
    
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 429,
        'message', 'Account temporarily locked. Please try again later.'
      )
    );
  END IF;

  -- Increment failed attempt counter
  INSERT INTO private.password_failed_verification_attempts (user_id, failed_attempts, last_failed_at)
  VALUES (user_uuid, 1, NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    failed_attempts = password_failed_verification_attempts.failed_attempts + 1,
    last_failed_at = NOW();

  -- Update profile with failed attempt
  UPDATE public.profiles 
  SET 
    failed_login_attempts = COALESCE(failed_login_attempts, 0) + 1,
    account_locked_until = CASE 
      WHEN COALESCE(failed_login_attempts, 0) + 1 >= max_attempts 
      THEN NOW() + lockout_duration
      ELSE account_locked_until
    END
  WHERE id = user_uuid;

  -- Get updated failed count
  SELECT failed_attempts INTO failed_count
  FROM private.password_failed_verification_attempts
  WHERE user_id = user_uuid;

  -- Log failed authentication
  INSERT INTO private.security_audit_log (
    event_type, user_id, severity, event_data
  ) VALUES (
    'user_login', user_uuid, 'warning',
    jsonb_build_object(
      'method', 'password', 
      'success', false,
      'failed_attempts', failed_count,
      'max_attempts', max_attempts
    )
  );

  -- Lock account if max attempts reached
  IF failed_count >= max_attempts THEN
    -- Update lockout timestamp
    UPDATE private.password_failed_verification_attempts 
    SET locked_until = NOW() + lockout_duration
    WHERE user_id = user_uuid;
    
    -- Log account lockout
    INSERT INTO private.security_audit_log (
      event_type, user_id, severity, event_data
    ) VALUES (
      'account_locked', user_uuid, 'high',
      jsonb_build_object(
        'reason', 'max_failed_attempts',
        'failed_attempts', failed_count,
        'locked_until', NOW() + lockout_duration
      )
    );
    
    RETURN jsonb_build_object(
      'error', jsonb_build_object(
        'http_code', 423,
        'message', 'Account locked due to too many failed attempts. Please try again later.'
      )
    );
  END IF;

  -- Continue with default Supabase behavior
  RETURN jsonb_build_object('decision', 'continue');
END;
$$;

-- =====================================================
-- 3. UTILITY FUNCTIONS
-- =====================================================

-- Function to log authentication attempts
CREATE OR REPLACE FUNCTION public.log_auth_attempt(
  attempt_email text,
  attempt_ip inet,
  attempt_type text,
  is_success boolean,
  failure_reason text DEFAULT NULL,
  user_agent_string text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_uuid uuid;
BEGIN
  -- Get user ID if email exists
  SELECT id INTO user_uuid FROM auth.users WHERE email = attempt_email;

  -- Insert auth attempt record
  INSERT INTO private.auth_attempts (
    ip, email, user_id, attempt_type, success, failure_reason, user_agent, attempted_at
  ) VALUES (
    attempt_ip, attempt_email, user_uuid, attempt_type, is_success, failure_reason, user_agent_string, NOW()
  );

  -- Log to security audit
  INSERT INTO private.security_audit_log (
    event_type, user_id, ip_address, severity, event_data
  ) VALUES (
    attempt_type, user_uuid, attempt_ip,
    CASE WHEN is_success THEN 'info' ELSE 'warning' END,
    jsonb_build_object(
      'email', attempt_email,
      'success', is_success,
      'failure_reason', failure_reason,
      'user_agent', user_agent_string
    )
  );
END;
$$;

-- =====================================================
-- 4. SESSION MANAGEMENT FUNCTIONS
-- =====================================================

-- Function to create a new user session
CREATE OR REPLACE FUNCTION public.create_user_session(
  user_uuid uuid,
  session_token text,
  client_ip inet,
  user_agent_string text,
  expires_in_hours integer DEFAULT 8
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_id uuid;
  max_sessions integer;
  current_sessions integer;
BEGIN
  -- Get max concurrent sessions configuration
  SELECT (value->>'max_concurrent_sessions')::integer INTO max_sessions
  FROM private.security_config WHERE key = 'max_concurrent_sessions';

  max_sessions := COALESCE(max_sessions, 5);

  -- Count current active sessions
  SELECT COUNT(*) INTO current_sessions
  FROM private.user_sessions
  WHERE user_id = user_uuid
    AND is_active = TRUE
    AND expires_at > NOW();

  -- Clean up expired sessions
  UPDATE private.user_sessions
  SET is_active = FALSE
  WHERE user_id = user_uuid
    AND expires_at <= NOW();

  -- If at max sessions, deactivate oldest session
  IF current_sessions >= max_sessions THEN
    UPDATE private.user_sessions
    SET is_active = FALSE
    WHERE id = (
      SELECT id FROM private.user_sessions
      WHERE user_id = user_uuid AND is_active = TRUE
      ORDER BY last_accessed_at ASC
      LIMIT 1
    );
  END IF;

  -- Create new session
  session_id := gen_random_uuid();

  INSERT INTO private.user_sessions (
    id, user_id, session_token, ip_address, user_agent, expires_at
  ) VALUES (
    session_id, user_uuid, session_token, client_ip, user_agent_string,
    NOW() + (expires_in_hours || ' hours')::interval
  );

  -- Log session creation
  INSERT INTO private.security_audit_log (
    event_type, user_id, ip_address, severity, event_data
  ) VALUES (
    'user_login', user_uuid, client_ip, 'info',
    jsonb_build_object(
      'session_id', session_id,
      'expires_at', NOW() + (expires_in_hours || ' hours')::interval,
      'user_agent', user_agent_string
    )
  );

  RETURN session_id;
END;
$$;

-- Function to validate and refresh session
CREATE OR REPLACE FUNCTION public.validate_session(session_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  session_record record;
  refresh_threshold interval;
  new_expires_at timestamp;
BEGIN
  -- Get session refresh threshold
  SELECT (value->>'session_refresh_threshold_minutes')::integer * interval '1 minute' INTO refresh_threshold
  FROM private.security_config WHERE key = 'session_refresh_threshold_minutes';

  refresh_threshold := COALESCE(refresh_threshold, interval '60 minutes');

  -- Get session details
  SELECT * INTO session_record
  FROM private.user_sessions
  WHERE session_token = validate_session.session_token
    AND is_active = TRUE
    AND expires_at > NOW();

  -- Return null if session not found or expired
  IF session_record IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'session_not_found_or_expired');
  END IF;

  -- Check if session is marked as suspicious or force logout
  IF session_record.is_suspicious OR session_record.force_logout THEN
    -- Deactivate session
    UPDATE private.user_sessions
    SET is_active = FALSE
    WHERE id = session_record.id;

    RETURN jsonb_build_object(
      'valid', false,
      'reason', CASE
        WHEN session_record.is_suspicious THEN 'suspicious_activity'
        ELSE 'forced_logout'
      END
    );
  END IF;

  -- Update last accessed time
  UPDATE private.user_sessions
  SET last_accessed_at = NOW()
  WHERE id = session_record.id;

  -- Check if session needs refresh (close to expiry)
  IF session_record.expires_at - NOW() < refresh_threshold THEN
    -- Extend session
    new_expires_at := NOW() + interval '8 hours'; -- Default session duration

    UPDATE private.user_sessions
    SET expires_at = new_expires_at
    WHERE id = session_record.id;

    RETURN jsonb_build_object(
      'valid', true,
      'user_id', session_record.user_id,
      'session_id', session_record.id,
      'refreshed', true,
      'new_expires_at', new_expires_at
    );
  END IF;

  RETURN jsonb_build_object(
    'valid', true,
    'user_id', session_record.user_id,
    'session_id', session_record.id,
    'refreshed', false,
    'expires_at', session_record.expires_at
  );
END;
$$;

-- Create profiles table with enhanced security fields
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  website TEXT,
  location TEXT,
  provider TEXT,
  provider_id TEXT,
  metadata JSONB DEFAULT '{}',

  -- Enhanced security fields
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'trader', 'analyst')),
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'locked', 'pending_verification')),
  mfa_enabled BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP WITH TIME ZONE,
  last_login_ip INET,
  failed_login_attempts INTEGER DEFAULT 0,
  account_locked_until TIMESTAMP WITH TIME ZONE,
  password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  privacy_policy_accepted_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Enhanced validation constraints
  CONSTRAINT profiles_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT profiles_username_format CHECK (username ~* '^[a-zA-Z0-9_-]{3,30}$'),
  CONSTRAINT profiles_failed_attempts_check CHECK (failed_login_attempts >= 0 AND failed_login_attempts <= 10)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anonymous users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can delete own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON public.profiles;

-- Create enhanced RLS policies for enterprise security

-- Restrict anonymous access - only allow viewing public profile info for active users
CREATE POLICY "Anonymous users can view limited public profiles"
  ON public.profiles FOR SELECT
  TO anon
  USING (
    account_status = 'active'
    AND (username IS NOT NULL OR full_name IS NOT NULL)
  );

-- Authenticated users can view profiles but with restrictions
CREATE POLICY "Authenticated users can view active profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    account_status IN ('active', 'pending_verification')
    OR auth.uid() = id  -- Users can always see their own profile
  );

-- Users can only insert their own profile with account verification
CREATE POLICY "Authenticated users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND account_status IN ('active', 'pending_verification')
    AND failed_login_attempts = 0
  );

-- Users can update their own profile with security restrictions
CREATE POLICY "Authenticated users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id
    AND account_status != 'suspended'
    AND (account_locked_until IS NULL OR account_locked_until < NOW())
  )
  WITH CHECK (
    auth.uid() = id
    AND account_status IN ('active', 'pending_verification', 'locked')
  );

-- Restrict profile deletion - only for non-suspended accounts
CREATE POLICY "Authenticated users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (
    auth.uid() = id
    AND account_status != 'suspended'
  );

-- Service role policies for system operations
CREATE POLICY "Service role can manage profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create enhanced trigger function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    username,
    provider,
    provider_id,
    metadata,
    role,
    account_status,
    mfa_enabled,
    failed_login_attempts,
    password_changed_at,
    last_login_at,
    last_login_ip
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'user_name', NEW.raw_user_meta_data->>'preferred_username'),
    COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
    NEW.raw_app_meta_data->>'provider_id',
    COALESCE(NEW.raw_user_meta_data, '{}'),
    'user', -- Default role
    CASE
      WHEN NEW.email_confirmed_at IS NOT NULL THEN 'active'
      ELSE 'pending_verification'
    END,
    FALSE, -- MFA disabled by default
    0, -- No failed attempts initially
    NOW(), -- Password changed at signup
    CASE WHEN NEW.last_sign_in_at IS NOT NULL THEN NEW.last_sign_in_at ELSE NOW() END,
    NULL -- No IP tracking in auth.users by default
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

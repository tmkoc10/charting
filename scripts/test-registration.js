/**
 * Simple User Registration Test Script
 *
 * This script tests the user registration flow using the existing auth service
 */

// Load environment variables
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testUserRegistration() {
  console.log('🧪 Testing User Registration Flow...\n')
  
  // Test data
  const testEmail = `test.user.${Date.now()}@gmail.com`
  const testPassword = 'TestPassword123!'
  const testFullName = 'Test User'
  
  try {
    console.log('1️⃣ Testing user signup...')
    
    // Test signup
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: testFullName,
        },
      },
    })
    
    if (signUpError) {
      console.log('❌ Signup failed:', signUpError.message)
      return
    }
    
    console.log('✅ Signup successful!')
    console.log('   User ID:', signUpData.user?.id)
    console.log('   Email confirmed:', signUpData.user?.email_confirmed_at ? 'Yes' : 'No')
    
    if (signUpData.user?.id) {
      console.log('\n2️⃣ Checking if profile was created...')
      
      // Wait a moment for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Check if profile was created by the trigger
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', signUpData.user.id)
        .single()
      
      if (profileError) {
        console.log('❌ Profile check failed:', profileError.message)
      } else if (profile) {
        console.log('✅ Profile created successfully!')
        console.log('   Profile ID:', profile.id)
        console.log('   Email:', profile.email)
        console.log('   Full Name:', profile.full_name)
        console.log('   Provider:', profile.provider)
      } else {
        console.log('⚠️  Profile not found - trigger may not have executed')
      }
    }
    
    console.log('\n3️⃣ Testing profile read access (anonymous)...')
    
    // Test anonymous read access
    const { data: publicProfiles, error: readError } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .limit(5)
    
    if (readError) {
      console.log('❌ Anonymous read failed:', readError.message)
    } else {
      console.log('✅ Anonymous read successful!')
      console.log(`   Found ${publicProfiles?.length || 0} profiles`)
    }
    
    console.log('\n4️⃣ Testing authentication state...')
    
    // Check current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.log('❌ Session check failed:', sessionError.message)
    } else if (session) {
      console.log('✅ User is authenticated!')
      console.log('   Session expires:', new Date(session.expires_at * 1000).toLocaleString())
    } else {
      console.log('ℹ️  No active session (email confirmation may be required)')
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message)
  }
}

async function testExistingProfiles() {
  console.log('\n📊 Checking existing profiles...')
  
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, provider, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.log('❌ Failed to fetch profiles:', error.message)
      return
    }
    
    console.log(`✅ Found ${profiles?.length || 0} existing profiles:`)
    profiles?.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.full_name || 'No name'} (${profile.email || 'No email'}) - ${profile.provider || 'email'}`)
    })
    
  } catch (error) {
    console.log('❌ Error checking profiles:', error.message)
  }
}

async function main() {
  console.log('🔍 User Registration System Test\n')
  console.log('Environment:')
  console.log('  Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('  Has Anon Key:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  console.log('')
  
  await testExistingProfiles()
  await testUserRegistration()
  
  console.log('\n✨ Test completed!')
}

// Run the test
main().catch(console.error)

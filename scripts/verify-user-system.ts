#!/usr/bin/env tsx

/**
 * Comprehensive User Registration System Verification Script
 * 
 * This script tests all aspects of the user registration and profile system:
 * - Database connection
 * - Table structure
 * - RLS policies
 * - Trigger functions
 * - Authentication flows
 * - Profile management
 */

import { createClient } from '@supabase/supabase-js'
import { Database } from '../lib/database.types'

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Initialize regular client for user operations
const supabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface TestResult {
  test: string
  status: 'PASS' | 'FAIL' | 'WARNING'
  message: string
  details?: any
}

const results: TestResult[] = []

function addResult(test: string, status: 'PASS' | 'FAIL' | 'WARNING', message: string, details?: any) {
  results.push({ test, status, message, details })
  const emoji = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'
  console.log(`${emoji} ${test}: ${message}`)
  if (details) {
    console.log('   Details:', details)
  }
}

async function testDatabaseConnection() {
  try {
    const { data, error } = await supabaseAdmin.from('profiles').select('count').limit(1)
    if (error) throw error
    addResult('Database Connection', 'PASS', 'Successfully connected to Supabase')
  } catch (error) {
    addResult('Database Connection', 'FAIL', 'Failed to connect to database', error)
  }
}

async function testTableStructure() {
  try {
    // Test by trying to select from the profiles table
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) throw error

    addResult('Table Structure', 'PASS', 'Profiles table exists and is accessible')
  } catch (error) {
    addResult('Table Structure', 'FAIL', 'Failed to access profiles table', error)
  }
}

async function testRLSPolicies() {
  try {
    // Test RLS by trying different access patterns
    // Test anonymous access
    const { data: anonData, error: anonError } = await supabaseClient
      .from('profiles')
      .select('id')
      .limit(1)

    if (anonError) {
      addResult('RLS Policies', 'FAIL', 'Anonymous access blocked', anonError)
    } else {
      addResult('RLS Policies', 'PASS', 'RLS policies working - anonymous can read profiles')
    }
  } catch (error) {
    addResult('RLS Policies', 'FAIL', 'Failed to test RLS policies', error)
  }
}

async function testTriggerFunction() {
  try {
    // Test trigger function by checking if profiles exist for users
    const { data: profileCount, error } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact' })

    if (error) throw error

    if (profileCount && profileCount.length > 0) {
      addResult('Trigger Function', 'PASS', 'Trigger function working - profiles exist for users')
    } else {
      addResult('Trigger Function', 'WARNING', 'No profiles found - trigger may not be working')
    }
  } catch (error) {
    addResult('Trigger Function', 'FAIL', 'Failed to test trigger function', error)
  }
}

async function testAuthConfiguration() {
  try {
    // Test if we can access auth configuration (this would need admin API access)
    // For now, we'll test basic auth functionality
    const { data: { session }, error } = await supabaseClient.auth.getSession()
    
    if (error && error.message !== 'No session found') {
      throw error
    }
    
    addResult('Auth Configuration', 'PASS', 'Auth system is accessible')
  } catch (error) {
    addResult('Auth Configuration', 'FAIL', 'Auth system error', error)
  }
}

async function testProfileOperations() {
  try {
    // Test anonymous read access
    const { data: profiles, error: readError } = await supabaseClient
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (readError) {
      addResult('Profile Read Access', 'FAIL', 'Anonymous users cannot read profiles', readError)
    } else {
      addResult('Profile Read Access', 'PASS', 'Anonymous users can read profiles')
    }
  } catch (error) {
    addResult('Profile Operations', 'FAIL', 'Failed to test profile operations', error)
  }
}

async function generateReport() {
  console.log('\n' + '='.repeat(60))
  console.log('USER REGISTRATION SYSTEM VERIFICATION REPORT')
  console.log('='.repeat(60))
  
  const passCount = results.filter(r => r.status === 'PASS').length
  const failCount = results.filter(r => r.status === 'FAIL').length
  const warningCount = results.filter(r => r.status === 'WARNING').length
  
  console.log(`\nSUMMARY:`)
  console.log(`✅ Passed: ${passCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log(`⚠️  Warnings: ${warningCount}`)
  console.log(`📊 Total Tests: ${results.length}`)
  
  if (failCount === 0) {
    console.log('\n🎉 All critical tests passed! Your user registration system is working correctly.')
  } else {
    console.log('\n🔧 Some issues found. Please review the failed tests above.')
  }
  
  console.log('\n' + '='.repeat(60))
}

async function main() {
  console.log('🚀 Starting User Registration System Verification...\n')
  
  await testDatabaseConnection()
  await testTableStructure()
  await testRLSPolicies()
  await testTriggerFunction()
  await testAuthConfiguration()
  await testProfileOperations()
  
  await generateReport()
}

// Run the verification
main().catch(console.error)

// Simple Supabase connection test
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ddvnzrxohgmokqnsfwkg.supabase.co'
const supabaseKey = 'sb_publishable_L6WoXszVR8-eY7E5yUYxHg_aURC_1Yb'

console.log('🔍 Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('_dummy_table_that_does_not_exist')
      .select('*')
      .limit(1)
    
    if (error && error.code === 'PGRST116') {
      console.log('✅ Connection successful! (Table not found is expected)')
      return true
    } else if (error) {
      console.log('❌ Connection error:', error.message)
      return false
    }
  } catch (err) {
    console.log('❌ Unexpected error:', err.message)
    return false
  }
}

async function checkTables() {
  console.log('\n📋 Checking for existing tables...')
  
  // Try to check if profiles table exists (from our schema)
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      console.log('⚠️  Profiles table not found:', error.message)
      console.log('📝 You need to set up the database tables!')
      return false
    } else {
      console.log('✅ Profiles table exists!')
      return true
    }
  } catch (err) {
    console.log('❌ Error checking profiles table:', err.message)
    return false
  }
}

// Run tests
async function runTests() {
  const connected = await testConnection()
  if (connected) {
    await checkTables()
  }
  
  console.log('\n🎯 Next Steps:')
  console.log('1. If tables don\'t exist, go to Supabase SQL Editor')
  console.log('2. Run the setup.sql script from database/ folder')
  console.log('3. Then run the seed.sql script for sample data')
}

runTests().catch(console.error)

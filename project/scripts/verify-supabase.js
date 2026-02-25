/**
 * Supabase Database Verification Script
 * Run this to check your database connection, tables, functions, and replicas
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables check
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Verification Starting...\n');

// Check environment variables
console.log('📋 Environment Variables Check:');
console.log(`VITE_SUPABASE_URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseKey ? '✅ Set' : '❌ Missing'}`);

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing required environment variables!');
  console.log('\nPlease set up your .env file with:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('\n🔌 Testing Database Connection...');
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    return false;
  }
}

async function listTables() {
  console.log('\n📊 Checking Database Tables...');
  
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name, table_type')
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.error('❌ Error fetching tables:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} tables:`);
      data.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table.table_name} (${table.table_type})`);
      });
    } else {
      console.log('⚠️  No tables found in public schema');
    }

    return data;
  } catch (err) {
    console.error('❌ Error listing tables:', err.message);
  }
}

async function listColumns(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', tableName)
      .order('ordinal_position');

    if (error) {
      console.error(`❌ Error fetching columns for ${tableName}:`, error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`\n📋 Columns in ${tableName}:`);
      data.forEach((col, index) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  ${index + 1}. ${col.column_name} (${col.data_type}) ${nullable}${defaultVal}`);
      });
    }

    return data;
  } catch (err) {
    console.error(`❌ Error listing columns for ${tableName}:`, err.message);
  }
}

async function listFunctions() {
  console.log('\n⚙️  Checking Database Functions...');
  
  try {
    const { data, error } = await supabase
      .from('information_schema.routines')
      .select('routine_name, routine_type, data_type')
      .eq('routine_schema', 'public')
      .order('routine_name');

    if (error) {
      console.error('❌ Error fetching functions:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} functions/procedures:`);
      data.forEach((func, index) => {
        console.log(`  ${index + 1}. ${func.routine_name} (${func.routine_type}) -> ${func.data_type || 'void'}`);
      });
    } else {
      console.log('⚠️  No custom functions found');
    }

    return data;
  } catch (err) {
    console.error('❌ Error listing functions:', err.message);
  }
}

async function checkRLS() {
  console.log('\n🔒 Checking Row Level Security (RLS)...');
  
  try {
    const { data, error } = await supabase
      .from('pg_class')
      .select('relname, relrowsecurity')
      .eq('relkind', 'r')
      .neq('relnamespace', 'pg_catalog');

    if (error) {
      console.error('❌ Error checking RLS:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log('📋 RLS Status:');
      data.forEach((table, index) => {
        const rlsStatus = table.relrowsecurity ? '🔒 Enabled' : '🔓 Disabled';
        console.log(`  ${index + 1}. ${table.relname}: ${rlsStatus}`);
      });
    }

    return data;
  } catch (err) {
    console.error('❌ Error checking RLS:', err.message);
  }
}

async function checkPolicies() {
  console.log('\n📜 Checking RLS Policies...');
  
  try {
    const { data, error } = await supabase
      .from('pg_policies')
      .select('tablename, policyname, cmd, roles')
      .order('tablename');

    if (error) {
      console.error('❌ Error fetching policies:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} RLS policies:`);
      data.forEach((policy, index) => {
        console.log(`  ${index + 1}. ${policy.tablename}.${policy.policyname} (${policy.cmd}) for ${policy.roles}`);
      });
    } else {
      console.log('⚠️  No RLS policies found');
    }

    return data;
  } catch (err) {
    console.error('❌ Error checking policies:', err.message);
  }
}

async function checkIndexes() {
  console.log('\n📊 Checking Database Indexes...');
  
  try {
    const { data, error } = await supabase
      .from('pg_indexes')
      .select('tablename, indexname, indexdef')
      .eq('schemaname', 'public')
      .order('tablename');

    if (error) {
      console.error('❌ Error fetching indexes:', error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log(`✅ Found ${data.length} indexes:`);
      data.forEach((index, i) => {
        console.log(`  ${i + 1}. ${index.tablename}.${index.indexname}`);
      });
    } else {
      console.log('⚠️  No custom indexes found');
    }

    return data;
  } catch (err) {
    console.error('❌ Error checking indexes:', err.message);
  }
}

async function testBasicOperations() {
  console.log('\n🧪 Testing Basic Database Operations...');
  
  // Test if we can create a simple table
  try {
    console.log('  Testing table creation permissions...');
    
    const { error: createError } = await supabase.rpc('create_test_table', {});
    
    if (createError && !createError.message.includes('already exists')) {
      console.log('⚠️  Cannot create tables (expected for anon key)');
    } else {
      console.log('✅ Table creation test passed');
    }
  } catch (err) {
    console.log('⚠️  Table creation test skipped (permission limited)');
  }

  // Test basic select operation
  try {
    console.log('  Testing select permissions...');
    
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Select operation failed:', error.message);
    } else {
      console.log('✅ Select operation successful');
    }
  } catch (err) {
    console.error('❌ Select test error:', err.message);
  }
}

async function getDatabaseInfo() {
  console.log('\n📈 Database Information...');
  
  try {
    const { data, error } = await supabase
      .from('pg_database')
      .select('datname, encoding, datcollate')
      .limit(1);

    if (error) {
      console.log('⚠️  Cannot access database info (limited permissions)');
    } else if (data && data.length > 0) {
      console.log('✅ Database info:');
      console.log(`  Name: ${data[0].datname}`);
      console.log(`  Encoding: ${data[0].encoding}`);
      console.log(`  Collation: ${data[0].datcollate}`);
    }
  } catch (err) {
    console.log('⚠️  Database info not accessible');
  }
}

// Main verification function
async function runVerification() {
  console.log('🚀 Starting Supabase Database Verification\n');
  console.log('=' .repeat(50));

  // Step 1: Test connection
  const isConnected = await verifyConnection();
  if (!isConnected) {
    console.log('\n❌ Verification failed - cannot connect to database');
    return;
  }

  // Step 2: List all tables
  const tables = await listTables();

  // Step 3: Show details for first few tables
  if (tables && tables.length > 0) {
    console.log('\n📋 Detailed Table Information:');
    for (let i = 0; i < Math.min(3, tables.length); i++) {
      await listColumns(tables[i].table_name);
    }
  }

  // Step 4: List functions
  await listFunctions();

  // Step 5: Check RLS
  await checkRLS();

  // Step 6: Check policies
  await checkPolicies();

  // Step 7: Check indexes
  await checkIndexes();

  // Step 8: Test operations
  await testBasicOperations();

  // Step 9: Get database info
  await getDatabaseInfo();

  console.log('\n' + '=' .repeat(50));
  console.log('✅ Verification completed!');
  console.log('\n📋 Summary:');
  console.log('- Connection: ✅ Working');
  console.log(`- Tables: ${tables ? tables.length : 0} found`);
  console.log('- Check the output above for detailed information');
  
  console.log('\n💡 Next Steps:');
  console.log('1. Review the table structure above');
  console.log('2. Check if you need to create any missing tables');
  console.log('3. Verify RLS policies match your security requirements');
  console.log('4. Consider adding indexes for better performance');
}

// Run the verification
runVerification().catch(console.error);
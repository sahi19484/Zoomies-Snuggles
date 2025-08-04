// Simple database setup script for Zoomies & Snuggles
// Usage: node database/simple-setup.js

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';

const { Pool } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'zoomies_snuggles',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: false,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

const pool = new Pool(dbConfig);

// Helper function to read SQL files
const readSQLFile = async (filename) => {
  const filePath = path.join(__dirname, filename);
  return await fs.readFile(filePath, 'utf8');
};

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Database connection successful:', result.rows[0].now);
    return true;
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    return false;
  }
};

// Execute SQL with better error handling
const executeSQL = async (sql, description) => {
  try {
    console.log(`📝 ${description}...`);
    
    // Split SQL into statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    let successCount = 0;
    for (const statement of statements) {
      try {
        await pool.query(statement);
        successCount++;
      } catch (error) {
        // Ignore "already exists" errors
        if (error.message.includes('already exists') || error.message.includes('duplicate')) {
          console.log(`   ⚠️  Skipped: ${error.message.split('\n')[0]}`);
        } else {
          console.error(`   ❌ Error: ${error.message}`);
          console.error(`   Statement: ${statement.substring(0, 100)}...`);
        }
      }
    }
    
    console.log(`✅ ${description} completed (${successCount} statements executed)`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
};

// Check database status
const checkStatus = async () => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    const tables = result.rows.map(row => row.table_name);
    const expectedTables = [
      'users', 'pets', 'pet_images', 'applications', 'medical_records',
      'community_posts', 'post_replies', 'post_likes', 'events', 
      'event_registrations', 'donations', 'messages', 'notifications',
      'resources', 'volunteer_activities', 'audit_log', 'settings', 'sync_log'
    ];
    
    const missingTables = expectedTables.filter(table => !tables.includes(table));
    
    console.log(`📊 Database Status:`);
    console.log(`   Tables found: ${tables.length}/${expectedTables.length}`);
    
    if (missingTables.length > 0) {
      console.log(`   Missing tables: ${missingTables.join(', ')}`);
      return false;
    } else {
      console.log(`   ✅ All expected tables present`);
      return true;
    }
  } catch (error) {
    console.error('❌ Status check failed:', error.message);
    return false;
  }
};

// Get sample statistics
const getStats = async () => {
  try {
    const stats = {};
    const tables = ['users', 'pets', 'applications', 'community_posts', 'events', 'donations'];
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = parseInt(result.rows[0].count);
      } catch (error) {
        stats[table] = 0;
      }
    }
    
    console.log(`📈 Record Counts:`);
    Object.entries(stats).forEach(([table, count]) => {
      console.log(`   ${table}: ${count}`);
    });
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get statistics:', error);
    return {};
  }
};

// Main setup function
const setupDatabase = async () => {
  console.log('🚀 Zoomies & Snuggles Database Setup\n');
  
  // Step 1: Test connection
  console.log('Step 1: Testing database connection...');
  const connected = await testConnection();
  if (!connected) {
    console.error('\n❌ Setup failed: Cannot connect to database');
    console.error('Please check your database configuration and ensure PostgreSQL is running.');
    process.exit(1);
  }
  
  // Step 2: Initialize schema
  console.log('\nStep 2: Initializing database schema...');
  try {
    const setupSQL = await readSQLFile('setup.sql');
    await executeSQL(setupSQL, 'Creating tables and indexes');
  } catch (error) {
    console.error('❌ Failed to read setup.sql:', error.message);
    process.exit(1);
  }
  
  // Step 3: Check status
  console.log('\nStep 3: Verifying database structure...');
  const statusOk = await checkStatus();
  
  if (!statusOk) {
    console.error('\n❌ Database setup incomplete');
    process.exit(1);
  }
  
  // Step 4: Add sample data
  console.log('\nStep 4: Adding sample data...');
  try {
    const seedSQL = await readSQLFile('seed.sql');
    await executeSQL(seedSQL, 'Adding sample data');
  } catch (error) {
    console.error('⚠️  Could not add sample data:', error.message);
    console.log('Database structure is ready, but sample data was not added.');
  }
  
  // Step 5: Final status
  console.log('\nStep 5: Final verification...');
  await getStats();
  
  console.log('\n🎉 Database setup completed successfully!');
  console.log('\nYour Zoomies & Snuggles database is ready to use.');
  console.log('\nNext steps:');
  console.log('  1. Start your application server');
  console.log('  2. Visit the application to begin using the system');
  console.log('  3. Login with admin credentials to manage the platform');
  
  // Cleanup
  await pool.end();
};

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0] || 'setup';

switch (command) {
  case 'setup':
    setupDatabase().catch(console.error);
    break;
    
  case 'status':
    console.log('🔍 Checking database status...\n');
    testConnection()
      .then(connected => {
        if (connected) {
          return checkStatus();
        }
        process.exit(1);
      })
      .then(statusOk => {
        if (statusOk) {
          return getStats();
        }
      })
      .then(() => {
        console.log('\n✅ Status check completed');
        pool.end();
      })
      .catch(error => {
        console.error('❌ Status check failed:', error);
        pool.end();
        process.exit(1);
      });
    break;
    
  case 'test':
    console.log('🔍 Testing database connection...\n');
    testConnection()
      .then(connected => {
        if (connected) {
          console.log('✅ Connection test passed');
        } else {
          console.error('❌ Connection test failed');
          process.exit(1);
        }
        pool.end();
      })
      .catch(error => {
        console.error('❌ Connection test error:', error);
        pool.end();
        process.exit(1);
      });
    break;
    
  default:
    console.log('Zoomies & Snuggles Database Setup');
    console.log('\nUsage:');
    console.log('  node database/simple-setup.js [command]');
    console.log('\nCommands:');
    console.log('  setup   - Complete database setup (default)');
    console.log('  status  - Check database status');
    console.log('  test    - Test database connection');
    console.log('\nExamples:');
    console.log('  node database/simple-setup.js setup');
    console.log('  node database/simple-setup.js status');
    break;
}

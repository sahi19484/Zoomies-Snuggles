// Database utility functions for Zoomies & Snuggles
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { query, transaction } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read SQL file helper
const readSQLFile = async (filename) => {
  const filePath = path.join(__dirname, filename);
  return await fs.readFile(filePath, 'utf8');
};

// Initialize database with schema
export const initializeDatabase = async () => {
  try {
    console.log('🚀 Initializing database schema...');
    const setupSQL = await readSQLFile('setup.sql');
    
    // Split and execute SQL statements
    const statements = setupSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    for (const statement of statements) {
      try {
        await query(statement);
      } catch (error) {
        // Ignore "already exists" errors
        if (!error.message.includes('already exists')) {
          console.error(`Error executing statement: ${statement.substring(0, 100)}...`);
          throw error;
        }
      }
    }
    
    console.log('✅ Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

// Seed database with sample data
export const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with sample data...');
    const seedSQL = await readSQLFile('seed.sql');
    
    // Execute seed data in a transaction
    await transaction(async (client) => {
      const statements = seedSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          await client.query(statement);
        } catch (error) {
          // Ignore duplicate key errors during seeding
          if (!error.message.includes('duplicate key')) {
            console.error(`Error executing seed statement: ${statement.substring(0, 100)}...`);
            throw error;
          }
        }
      }
    });
    
    console.log('✅ Database seeded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
};

// Check if database tables exist
export const checkDatabaseStatus = async () => {
  try {
    const result = await query(`
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
    
    return {
      tablesExist: tables.length > 0,
      totalTables: tables.length,
      expectedTables: expectedTables.length,
      missingTables,
      tables
    };
  } catch (error) {
    console.error('❌ Failed to check database status:', error);
    return { tablesExist: false, error: error.message };
  }
};

// Get database statistics
export const getDatabaseStats = async () => {
  try {
    const stats = {};
    
    // Count records in main tables
    const tables = ['users', 'pets', 'applications', 'community_posts', 'events', 'donations'];
    
    for (const table of tables) {
      try {
        const result = await query(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = parseInt(result.rows[0].count);
      } catch (error) {
        stats[table] = 0;
      }
    }
    
    // Get additional stats
    const adoptedPets = await query(`
      SELECT COUNT(*) as count FROM pets WHERE status = 'adopted'
    `);
    stats.adopted_pets = parseInt(adoptedPets.rows[0].count);
    
    const activeFosters = await query(`
      SELECT COUNT(*) as count FROM pets WHERE status = 'fostered'
    `);
    stats.fostered_pets = parseInt(activeFosters.rows[0].count);
    
    const totalDonations = await query(`
      SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE payment_status = 'completed'
    `);
    stats.total_donations = parseFloat(totalDonations.rows[0].total);
    
    return stats;
  } catch (error) {
    console.error('❌ Failed to get database statistics:', error);
    return {};
  }
};

// Clean up old data (for maintenance)
export const cleanupDatabase = async () => {
  try {
    console.log('🧹 Cleaning up old database records...');
    
    await transaction(async (client) => {
      // Delete old audit logs (older than 90 days)
      await client.query(`
        DELETE FROM audit_log 
        WHERE created_at < NOW() - INTERVAL '90 days'
      `);
      
      // Delete old sync logs (older than 30 days)
      await client.query(`
        DELETE FROM sync_log 
        WHERE sync_timestamp < NOW() - INTERVAL '30 days'
      `);
      
      // Delete old notifications (older than 30 days and read)
      await client.query(`
        DELETE FROM notifications 
        WHERE created_at < NOW() - INTERVAL '30 days' 
        AND read_at IS NOT NULL
      `);
      
      // Archive old messages (older than 1 year)
      await client.query(`
        UPDATE messages 
        SET archived_by_sender = true, archived_by_recipient = true
        WHERE created_at < NOW() - INTERVAL '1 year'
        AND archived_by_sender = false 
        AND archived_by_recipient = false
      `);
    });
    
    console.log('✅ Database cleanup completed');
    return true;
  } catch (error) {
    console.error('❌ Failed to cleanup database:', error);
    throw error;
  }
};

// Backup database (export important data)
export const backupDatabase = async () => {
  try {
    console.log('💾 Creating database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {};
    
    // Export critical tables
    const criticalTables = ['users', 'pets', 'applications', 'medical_records', 'donations'];
    
    for (const table of criticalTables) {
      const result = await query(`SELECT * FROM ${table}`);
      backupData[table] = result.rows;
    }
    
    // Export settings
    const settings = await query(`SELECT * FROM settings`);
    backupData.settings = settings.rows;
    
    // Save backup to file
    const backupPath = path.join(__dirname, `backup_${timestamp}.json`);
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    
    console.log(`✅ Database backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('❌ Failed to backup database:', error);
    throw error;
  }
};

// Health check for database
export const healthCheck = async () => {
  try {
    const start = Date.now();
    
    // Test basic connectivity
    await query('SELECT 1');
    
    // Test table access
    await query('SELECT COUNT(*) FROM users LIMIT 1');
    
    // Test write capability
    await query(`
      INSERT INTO audit_log (table_name, record_id, action, user_id) 
      VALUES ('health_check', gen_random_uuid(), 'test', NULL)
    `);
    
    const responseTime = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Database migration runner
export const runMigrations = async () => {
  try {
    console.log('🔄 Running database migrations...');
    
    // Create migrations table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check for migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    
    try {
      const files = await fs.readdir(migrationsDir);
      const migrationFiles = files
        .filter(file => file.endsWith('.sql'))
        .sort();
      
      for (const file of migrationFiles) {
        // Check if migration already executed
        const existing = await query(
          'SELECT id FROM migrations WHERE filename = $1',
          [file]
        );
        
        if (existing.rows.length === 0) {
          console.log(`Running migration: ${file}`);
          
          const migrationSQL = await fs.readFile(
            path.join(migrationsDir, file), 
            'utf8'
          );
          
          await transaction(async (client) => {
            // Execute migration
            await client.query(migrationSQL);
            
            // Record migration
            await client.query(
              'INSERT INTO migrations (filename) VALUES ($1)',
              [file]
            );
          });
          
          console.log(`✅ Migration completed: ${file}`);
        }
      }
      
      console.log('✅ All migrations completed');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('📁 No migrations directory found, skipping...');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to run migrations:', error);
    throw error;
  }
};

export default {
  initializeDatabase,
  seedDatabase,
  checkDatabaseStatus,
  getDatabaseStats,
  cleanupDatabase,
  backupDatabase,
  healthCheck,
  runMigrations
};

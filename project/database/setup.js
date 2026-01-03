#!/usr/bin/env node

// Database setup script for Zoomies & Snuggles
// Usage: node database/setup.js [options]

import { program } from 'commander';
import { testConnection } from './config.js';
import {
  initializeDatabase,
  seedDatabase,
  checkDatabaseStatus,
  getDatabaseStats,
  cleanupDatabase,
  backupDatabase,
  healthCheck,
  runMigrations
} from './utils.js';

// CLI program setup
program
  .name('db-setup')
  .description('Database management utilities for Zoomies & Snuggles')
  .version('1.0.0');

// Initialize command
program
  .command('init')
  .description('Initialize database schema')
  .option('--force', 'Force initialization even if tables exist')
  .action(async (options) => {
    try {
      console.log('🎯 Initializing Zoomies & Snuggles database...\n');
      
      // Test connection first
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database. Please check your configuration.');
        process.exit(1);
      }
      
      // Check existing status
      if (!options.force) {
        const status = await checkDatabaseStatus();
        if (status.tablesExist && status.missingTables.length === 0) {
          console.log('✅ Database already initialized. Use --force to reinitialize.');
          process.exit(0);
        }
      }
      
      // Initialize schema
      await initializeDatabase();
      
      console.log('\n🎉 Database initialization completed successfully!');
      console.log('\nNext steps:');
      console.log('  1. Run "node database/setup.js seed" to add sample data');
      console.log('  2. Run "node database/setup.js status" to verify setup');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      process.exit(1);
    }
  });

// Seed command
program
  .command('seed')
  .description('Seed database with sample data')
  .option('--force', 'Force seeding even if data exists')
  .action(async (options) => {
    try {
      console.log('🌱 Seeding database with sample data...\n');
      
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database.');
        process.exit(1);
      }
      
      // Check if database is initialized
      const status = await checkDatabaseStatus();
      if (!status.tablesExist) {
        console.error('❌ Database not initialized. Run "init" command first.');
        process.exit(1);
      }
      
      // Check if data already exists
      if (!options.force) {
        const stats = await getDatabaseStats();
        if (stats.users > 1) { // More than just admin user
          console.log('✅ Database already contains data. Use --force to reseed.');
          process.exit(0);
        }
      }
      
      await seedDatabase();
      
      console.log('\n🎉 Database seeding completed successfully!');
      
      // Show stats
      const stats = await getDatabaseStats();
      console.log('\n📊 Database Statistics:');
      console.log(`  Users: ${stats.users}`);
      console.log(`  Pets: ${stats.pets}`);
      console.log(`  Applications: ${stats.applications}`);
      console.log(`  Community Posts: ${stats.community_posts}`);
      console.log(`  Events: ${stats.events}`);
      
    } catch (error) {
      console.error('❌ Seeding failed:', error.message);
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Check database status and health')
  .action(async () => {
    try {
      console.log('🔍 Checking database status...\n');
      
      // Test connection
      console.log('🔗 Testing database connection...');
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Database connection failed');
        process.exit(1);
      }
      
      // Check schema
      console.log('📋 Checking database schema...');
      const status = await checkDatabaseStatus();
      console.log(`  Tables found: ${status.totalTables}/${status.expectedTables}`);
      
      if (status.missingTables.length > 0) {
        console.log('  Missing tables:', status.missingTables.join(', '));
      } else {
        console.log('  ✅ All expected tables present');
      }
      
      // Get statistics
      console.log('\n📊 Database Statistics:');
      const stats = await getDatabaseStats();
      Object.entries(stats).forEach(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log(`  ${label}: ${value}`);
      });
      
      // Health check
      console.log('\n🏥 Health Check:');
      const health = await healthCheck();
      console.log(`  Status: ${health.status}`);
      console.log(`  Response Time: ${health.responseTime || 'N/A'}`);
      if (health.error) {
        console.log(`  Error: ${health.error}`);
      }
      
      console.log('\n✅ Status check completed');
      
    } catch (error) {
      console.error('❌ Status check failed:', error.message);
      process.exit(1);
    }
  });

// Migrate command
program
  .command('migrate')
  .description('Run database migrations')
  .action(async () => {
    try {
      console.log('🔄 Running database migrations...\n');
      
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database.');
        process.exit(1);
      }
      
      await runMigrations();
      console.log('\n✅ Migrations completed successfully');
      
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  });

// Backup command
program
  .command('backup')
  .description('Create database backup')
  .action(async () => {
    try {
      console.log('💾 Creating database backup...\n');
      
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database.');
        process.exit(1);
      }
      
      const backupPath = await backupDatabase();
      console.log(`\n✅ Backup created successfully: ${backupPath}`);
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      process.exit(1);
    }
  });

// Cleanup command
program
  .command('cleanup')
  .description('Clean up old database records')
  .option('--dry-run', 'Show what would be cleaned without doing it')
  .action(async (options) => {
    try {
      console.log('🧹 Database cleanup...\n');
      
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database.');
        process.exit(1);
      }
      
      if (options.dryRun) {
        console.log('🔍 Dry run mode - no changes will be made');
        // TODO: Implement dry run logic
        console.log('Would clean up:');
        console.log('  - Audit logs older than 90 days');
        console.log('  - Sync logs older than 30 days');
        console.log('  - Read notifications older than 30 days');
        console.log('  - Archive messages older than 1 year');
      } else {
        await cleanupDatabase();
        console.log('\n✅ Database cleanup completed');
      }
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      process.exit(1);
    }
  });

// Setup command (full setup)
program
  .command('setup')
  .description('Complete database setup (init + seed)')
  .option('--skip-seed', 'Skip seeding sample data')
  .action(async (options) => {
    try {
      console.log('🚀 Complete database setup for Zoomies & Snuggles...\n');
      
      // Test connection
      const connected = await testConnection();
      if (!connected) {
        console.error('❌ Cannot connect to database. Please check your configuration.');
        process.exit(1);
      }
      
      // Initialize
      console.log('1️⃣ Initializing database schema...');
      await initializeDatabase();
      console.log('✅ Schema initialized\n');
      
      // Run migrations
      console.log('2️⃣ Running migrations...');
      await runMigrations();
      console.log('✅ Migrations completed\n');
      
      // Seed data (if not skipped)
      if (!options.skipSeed) {
        console.log('3️⃣ Seeding sample data...');
        await seedDatabase();
        console.log('✅ Sample data added\n');
      }
      
      // Final status
      const stats = await getDatabaseStats();
      console.log('🎉 Database setup completed successfully!\n');
      console.log('📊 Final Statistics:');
      Object.entries(stats).forEach(([key, value]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        console.log(`  ${label}: ${value}`);
      });
      
      console.log('\n🌟 Your Zoomies & Snuggles database is ready!');
      console.log('\nNext steps:');
      console.log('  1. Start your application server');
      console.log('  2. Visit the admin panel to configure settings');
      console.log('  3. Begin adding real pets and users');
      
    } catch (error) {
      console.error('❌ Setup failed:', error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

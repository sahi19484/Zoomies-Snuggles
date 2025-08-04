# Zoomies & Snuggles Database

This directory contains the complete database setup and management system for the Zoomies & Snuggles pet adoption platform.

## 📁 Directory Structure

```
database/
├── README.md           # This file - database documentation
├── schema.md          # Detailed database schema documentation
├── setup.sql          # SQL script to create all tables and indexes
├── seed.sql           # Sample data for development/testing
├── config.js          # Database connection configuration
├── utils.js           # Database utility functions
├── setup.js           # CLI tool for database management
└── migrations/        # Database migration files (create as needed)
```

## 🚀 Quick Start

### Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 16+ installed
- Environment variables configured (see `.env.example`)

### 1. Configure Environment

Copy the environment template and configure your database settings:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zoomies_snuggles
DB_USER=your_username
DB_PASSWORD=your_password
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Option A: Complete setup (recommended for first time):
```bash
node database/setup.js setup
```

Option B: Step by step:
```bash
# Initialize schema
node database/setup.js init

# Add sample data
node database/setup.js seed

# Check status
node database/setup.js status
```

## 🛠 Database Management Commands

The `setup.js` script provides several management commands:

### Setup Commands

```bash
# Complete database setup (init + migrate + seed)
node database/setup.js setup

# Initialize database schema only
node database/setup.js init

# Seed with sample data
node database/setup.js seed

# Run migrations
node database/setup.js migrate
```

### Maintenance Commands

```bash
# Check database status and health
node database/setup.js status

# Create backup
node database/setup.js backup

# Clean up old records
node database/setup.js cleanup

# Clean up (dry run - see what would be cleaned)
node database/setup.js cleanup --dry-run
```

### Command Options

```bash
# Force operations even if data exists
node database/setup.js init --force
node database/setup.js seed --force

# Skip seeding during setup
node database/setup.js setup --skip-seed
```

## 📊 Database Schema

The database consists of 18 main tables supporting all platform features:

### Core Tables
- **users** - User accounts (adopters, foster parents, volunteers, organizations, admins)
- **pets** - Pet profiles with detailed information
- **pet_images** - Multiple images per pet
- **applications** - Adoption and foster applications
- **medical_records** - Complete medical history for pets

### Community Features
- **community_posts** - Forum posts and discussions
- **post_replies** - Threaded replies to posts
- **post_likes** - User likes on posts and replies
- **events** - Community events and workshops
- **event_registrations** - Event attendee registration

### Communication & Support
- **messages** - Direct messaging between users
- **notifications** - System notifications
- **donations** - Donation tracking and receipts
- **resources** - Educational content and documents

### Administrative
- **volunteer_activities** - Volunteer hour tracking
- **audit_log** - Complete audit trail
- **settings** - System configuration
- **sync_log** - Google Sheets synchronization logs

For detailed schema information, see [schema.md](./schema.md).

## 🔧 Using Database Models

The platform includes pre-built models for easy database interaction:

```javascript
import { models } from '../src/models/index.js';

// Get available pets
const pets = await models.Pet.getAvailablePets({
  species: 'dog',
  size: 'medium'
});

// Create new user
const user = await models.User.createUser({
  email: 'user@example.com',
  name: 'John Doe',
  user_type: 'adopter',
  password_hash: hashedPassword
});

// Get applications with details
const applications = await models.Application.getApplicationsWithDetails({
  status: 'under_review'
});
```

## 🔍 Database Health Monitoring

### Status Check
```bash
node database/setup.js status
```

This provides:
- Connection test
- Table count verification
- Record statistics
- Health check with response time

### Example Output
```
🔗 Testing database connection...
✅ Connected to PostgreSQL database

📋 Checking database schema...
  Tables found: 18/18
  ✅ All expected tables present

📊 Database Statistics:
  Users: 5
  Pets: 12
  Applications: 8
  Community Posts: 15
  Events: 6
  Donations: 3

🏥 Health Check:
  Status: healthy
  Response Time: 45ms
```

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own data
- Admin users have elevated permissions
- Organization users can access relevant records

### Data Protection
- Password hashing with bcrypt
- Audit logging for all critical operations
- Input validation and sanitization
- SQL injection prevention

### Backup Strategy
- Automated daily backups (when configured)
- Manual backup command available
- Critical data export functionality

## 🔄 Google Sheets Integration

The database supports bidirectional synchronization with Google Sheets:

### Setup
1. Configure Google Sheets credentials in `.env`
2. Create spreadsheet with required structure
3. Enable sync in settings table

### Monitoring
- Sync logs stored in `sync_log` table
- Error tracking and retry logic
- Conflict resolution strategies

## 🚨 Troubleshooting

### Common Issues

**Connection Failed**
```bash
❌ Database connection test failed
```
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Tables Missing**
```bash
Tables found: 0/18
Missing tables: users, pets, ...
```
- Run `node database/setup.js init`
- Check PostgreSQL permissions

**Migration Errors**
```bash
❌ Migration failed
```
- Check SQL syntax in migration files
- Verify database permissions
- Review error logs

### Getting Help

1. Check the logs in PostgreSQL
2. Run `node database/setup.js status` for diagnostics
3. Review the schema documentation
4. Check environment variables

## 📈 Performance Optimization

### Indexes
- Comprehensive indexing for all query patterns
- Full-text search indexes for pets and posts
- Composite indexes for complex queries

### Query Optimization
- Connection pooling configured
- Prepared statements used
- Transaction management for data integrity

### Monitoring
- Query performance logging
- Connection pool monitoring
- Health check endpoints

## 🔄 Database Maintenance

### Regular Tasks
```bash
# Weekly cleanup (automated via cron)
node database/setup.js cleanup

# Monthly backup
node database/setup.js backup

# Health check
node database/setup.js status
```

### Performance Tuning
- Monitor slow queries
- Update table statistics: `ANALYZE;`
- Rebuild indexes if needed: `REINDEX;`

## 📝 Development Notes

### Adding New Tables
1. Add table definition to `setup.sql`
2. Create migration file in `migrations/`
3. Update models if needed
4. Add to backup/cleanup scripts

### Migration Files
Create numbered migration files:
```
migrations/
├── 001_add_user_preferences.sql
├── 002_add_pet_tags.sql
└── 003_update_notification_types.sql
```

### Testing
- Use separate test database
- Run `setup --skip-seed` for clean testing
- Reset with `init --force` between tests

This database system provides a robust foundation for the Zoomies & Snuggles platform, supporting all current features while being extensible for future enhancements.

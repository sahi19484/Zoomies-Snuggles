# Quick Database Setup Guide

## 🚀 Simple Setup (Recommended)

### Prerequisites
- PostgreSQL installed and running
- Node.js 16+ installed

### Step 1: Configure Environment
Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zoomies_snuggles
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### Step 2: Create Database
In PostgreSQL, create the database:

```sql
CREATE DATABASE zoomies_snuggles;
```

### Step 3: Run Setup
```bash
# Navigate to project directory
cd project

# Install dependencies (if not already done)
npm install

# Run simple setup
node database/simple-setup.js setup
```

## 🔧 Available Commands

### Complete Setup
```bash
node database/simple-setup.js setup
```
This will:
- Test database connection
- Create all tables and indexes
- Add sample data
- Verify everything is working

### Check Status
```bash
node database/simple-setup.js status
```
Shows:
- Database connection status
- Table count verification
- Record statistics

### Test Connection
```bash
node database/simple-setup.js test
```
Simply tests if the database connection works.

## ✅ Expected Output

When setup is successful, you should see:

```
🚀 Zoomies & Snuggles Database Setup

Step 1: Testing database connection...
✅ Database connection successful: 2024-01-20T10:30:45.123Z

Step 2: Initializing database schema...
📝 Creating tables and indexes...
✅ Creating tables and indexes completed (85 statements executed)

Step 3: Verifying database structure...
📊 Database Status:
   Tables found: 18/18
   ✅ All expected tables present

Step 4: Adding sample data...
📝 Adding sample data...
✅ Adding sample data completed (45 statements executed)

Step 5: Final verification...
📈 Record Counts:
   users: 5
   pets: 5
   applications: 2
   community_posts: 3
   events: 3
   donations: 3

🎉 Database setup completed successfully!

Your Zoomies & Snuggles database is ready to use.
```

## 🛠 Troubleshooting

### Connection Failed
```
❌ Database connection failed: connection refused
```
**Solutions:**
- Check if PostgreSQL is running
- Verify host and port in `.env`
- Ensure database exists

### Permission Denied
```
❌ Database connection failed: permission denied
```
**Solutions:**
- Check username and password
- Verify user has CREATE privileges
- Try connecting with psql first

### Tables Already Exist
```
⚠️  Skipped: relation "users" already exists
```
**This is normal** - the script skips existing tables and continues.

## 📊 What Gets Created

### Tables (18 total)
- **users** - All user types (adopters, foster parents, volunteers, organizations, admins)
- **pets** - Pet profiles with detailed information
- **pet_images** - Multiple images per pet
- **applications** - Adoption and foster applications
- **medical_records** - Pet medical history
- **community_posts** - Forum posts and discussions
- **post_replies** - Threaded replies
- **post_likes** - User likes on posts
- **events** - Community events and workshops
- **event_registrations** - Event attendees
- **messages** - Direct messaging
- **notifications** - System notifications
- **donations** - Donation tracking
- **resources** - Educational content
- **volunteer_activities** - Volunteer hours
- **audit_log** - Complete audit trail
- **settings** - System configuration
- **sync_log** - Google Sheets sync logs

### Sample Data
- 5 users (including admin)
- 5 pets with images
- Sample applications and medical records
- Community posts and events
- Test donations and activities

### Default Admin User
- **Email:** admin@zoomiessnuggles.org
- **Password:** admin123
- **Type:** admin

## 🔄 Alternative: Advanced Setup

If you need more control, use the advanced CLI tool:

```bash
# Install CLI dependency first
npm install commander

# Then use advanced commands
node database/setup.js setup
node database/setup.js backup
node database/setup.js cleanup
```

## 🎯 Next Steps

After successful setup:

1. **Start your application**
2. **Login as admin** to configure settings
3. **Add real pets and users**
4. **Test all functionality**

Your Zoomies & Snuggles database is now ready for production use! 🐕🐱

# Supabase Setup Guide for Zoomies & Snuggles

## 🚀 Quick Setup

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up/in with GitHub
4. Click "New Project"
5. Choose organization and name your project: `zoomies-snuggles`
6. Set a strong database password
7. Choose your region (closest to your users)
8. Click "Create new project"

### Step 2: Get Your API Keys

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### Step 3: Configure Environment Variables

Create a `.env` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key
```

**Important:** 
- Use `VITE_` prefix for frontend environment variables
- Never share your service role key in frontend code
- Add `.env` to your `.gitignore` file

## 🗄️ Database Setup

### Option 1: Use Supabase SQL Editor (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste the content from `database/setup.sql`
4. Click "Run"
5. Copy and paste the content from `database/seed.sql`
6. Click "Run"

### Option 2: Use Database URL with our script

1. Go to **Settings** → **Database**
2. Copy the connection string
3. Update your `.env`:

```env
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your-database-password
```

4. Run: `node database/simple-setup.js setup`

## 🔐 Authentication Setup

### Enable Email Authentication

1. Go to **Authentication** → **Settings**
2. Under "Auth Providers", ensure **Email** is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation, reset password, etc.

### Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:5173` (for development)
   - **Redirect URLs**: Add `http://localhost:5173/**` (for development)

For production, add your actual domain.

## 📋 Required Database Tables

The following tables will be created by running the setup scripts:

### Core Tables
- `profiles` - User profile information
- `pets` - Pet listings with details
- `pet_images` - Multiple images per pet
- `applications` - Adoption/foster applications
- `medical_records` - Pet medical history

### Community Features
- `community_posts` - Forum posts
- `post_replies` - Threaded replies
- `post_likes` - User likes on posts
- `events` - Community events
- `event_registrations` - Event attendees

### Communication
- `messages` - Direct messaging
- `notifications` - System notifications
- `donations` - Donation tracking

### Administrative
- `volunteer_activities` - Volunteer hours
- `audit_log` - Activity tracking
- `settings` - System configuration

## 🔄 Row Level Security (RLS)

Supabase automatically enables RLS. Here are the key policies:

### Profiles Table
```sql
-- Users can read all profiles but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Pets Table
```sql
-- Anyone can view available pets
CREATE POLICY "Pets are viewable by everyone" ON pets FOR SELECT USING (status = 'available');
-- Only admins/organizations can manage pets
CREATE POLICY "Admins can manage pets" ON pets FOR ALL USING (auth.user_type() IN ('admin', 'organization'));
```

### Applications Table
```sql
-- Users can view their own applications
CREATE POLICY "Users can view own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON applications FOR SELECT USING (auth.user_type() = 'admin');
```

## 🛠 Testing Your Setup

### 1. Test Authentication

Navigate to `/auth` in your app and try:
- Creating a new account
- Signing in with existing account
- Password reset (check email)

### 2. Test Database Connection

Open browser console and run:
```javascript
import { supabase } from './src/lib/supabase.js'
const { data, error } = await supabase.from('profiles').select('*').limit(1)
console.log(data, error)
```

### 3. Test Real-time Features

```javascript
// Subscribe to pets changes
const channel = supabase
  .channel('pets_channel')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'pets' }, (payload) => {
    console.log('Pet updated:', payload)
  })
  .subscribe()
```

## 🚨 Troubleshooting

### "Invalid API key" Error
- Check your environment variables
- Ensure `VITE_` prefix is used
- Restart your development server

### "Row Level Security" Errors
- Check if RLS policies are set up correctly
- Ensure user is authenticated
- Verify user permissions

### Email Not Sending
- Check **Authentication** → **Settings** → **SMTP**
- Verify email templates are configured
- Check spam folder

### Database Connection Failed
- Verify database password
- Check connection string format
- Ensure database is running

## 📚 Next Steps

1. **Customize User Profiles**: Add custom fields to the profiles table
2. **Set Up Storage**: Use Supabase Storage for pet images
3. **Add Real-time Features**: Implement live chat, notifications
4. **Configure Email Templates**: Customize welcome, reset emails
5. **Set Up Analytics**: Track user engagement and adoption success

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Authentication Guide](https://supabase.com/docs/guides/auth)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

Your Zoomies & Snuggles platform is now connected to Supabase! 🐕🐱

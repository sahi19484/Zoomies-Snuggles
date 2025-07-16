# API Documentation

## 🔗 API Overview

The Zoomies & Snuggles platform uses Supabase as the backend service, providing a RESTful API with real-time capabilities. All API interactions are handled through the Supabase JavaScript client.

## 🔐 Authentication

### Base Configuration
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
const supabase = createClient(supabaseUrl, supabaseKey)
```

### Authentication Methods

#### Sign Up
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      name: 'John Doe',
      user_type: 'adopter'
    }
  }
})
```

#### Sign In
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

#### Sign Out
```javascript
const { error } = await supabase.auth.signOut()
```

#### Get Current User
```javascript
const { data: { user } } = await supabase.auth.getUser()
```

## 👥 User Management API

### Get User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### Update User Profile
```javascript
const { data, error } = await supabase
  .from('users')
  .update({
    name: 'Updated Name',
    phone: '+91 9876543210',
    location: 'Rajkot, Gujarat'
  })
  .eq('id', userId)
```

### Get User Profile Extended
```javascript
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', userId)
  .single()
```

## 🐾 Pet Management API

### Get All Pets
```javascript
const { data, error } = await supabase
  .from('pets')
  .select(`
    *,
    pet_images(*),
    medical_records(*)
  `)
  .eq('status', 'available')
  .order('created_at', { ascending: false })
```

### Get Pet by ID
```javascript
const { data, error } = await supabase
  .from('pets')
  .select(`
    *,
    pet_images(*),
    medical_records(*),
    adoption_applications(*)
  `)
  .eq('id', petId)
  .single()
```

### Search Pets with Filters
```javascript
let query = supabase
  .from('pets')
  .select('*')
  .eq('status', 'available')

if (species) query = query.eq('species', species)
if (size) query = query.eq('size', size)
if (gender) query = query.eq('gender', gender)
if (location) query = query.ilike('current_location', `%${location}%`)

const { data, error } = await query
```

### Add New Pet
```javascript
const { data, error } = await supabase
  .from('pets')
  .insert({
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age_years: 2,
    size: 'large',
    gender: 'male',
    description: 'Friendly and energetic dog',
    status: 'available',
    current_location: 'Rajkot Central'
  })
```

### Update Pet Status
```javascript
const { data, error } = await supabase
  .from('pets')
  .update({ status: 'adopted' })
  .eq('id', petId)
```

## 📝 Adoption Applications API

### Submit Adoption Application
```javascript
const { data, error } = await supabase
  .from('adoption_applications')
  .insert({
    pet_id: petId,
    applicant_id: userId,
    reason_for_adoption: 'Looking for a family companion',
    previous_pet_experience: 'Had dogs for 10 years',
    living_situation: 'House with yard',
    status: 'submitted'
  })
```

### Get User Applications
```javascript
const { data, error } = await supabase
  .from('adoption_applications')
  .select(`
    *,
    pets(name, species, breed, pet_images(*))
  `)
  .eq('applicant_id', userId)
  .order('created_at', { ascending: false })
```

### Update Application Status
```javascript
const { data, error } = await supabase
  .from('adoption_applications')
  .update({
    status: 'approved',
    decision_date: new Date().toISOString(),
    decision_reason: 'Great match for this pet'
  })
  .eq('id', applicationId)
```

## 🏠 Foster Care API

### Submit Foster Application
```javascript
const { data, error } = await supabase
  .from('foster_placements')
  .insert({
    pet_id: petId,
    foster_parent_id: userId,
    foster_type: 'emergency',
    start_date: new Date().toISOString(),
    expected_end_date: futureDate,
    status: 'active'
  })
```

### Get Active Foster Placements
```javascript
const { data, error } = await supabase
  .from('foster_placements')
  .select(`
    *,
    pets(name, species, breed),
    users(name, email, phone)
  `)
  .eq('status', 'active')
```

## 📅 Events API

### Get Upcoming Events
```javascript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .gte('start_date', new Date().toISOString())
  .eq('status', 'scheduled')
  .order('start_date', { ascending: true })
```

### Register for Event
```javascript
const { data, error } = await supabase
  .from('event_registrations')
  .insert({
    event_id: eventId,
    user_id: userId,
    attendees_count: 2,
    registration_status: 'registered'
  })
```

### Get Event Registrations
```javascript
const { data, error } = await supabase
  .from('event_registrations')
  .select(`
    *,
    events(title, start_date, location)
  `)
  .eq('user_id', userId)
```

## 💬 Community API

### Get Community Posts
```javascript
const { data, error } = await supabase
  .from('community_posts')
  .select(`
    *,
    users(name),
    post_replies(count)
  `)
  .eq('moderation_status', 'approved')
  .order('created_at', { ascending: false })
  .limit(20)
```

### Create Community Post
```javascript
const { data, error } = await supabase
  .from('community_posts')
  .insert({
    author_id: userId,
    title: 'Tips for new dog owners',
    content: 'Here are some helpful tips...',
    post_type: 'discussion',
    category: 'training_tips'
  })
```

### Add Post Reply
```javascript
const { data, error } = await supabase
  .from('post_replies')
  .insert({
    post_id: postId,
    author_id: userId,
    content: 'Great advice! Thanks for sharing.'
  })
```

## 📚 Resources API

### Get Resources
```javascript
const { data, error } = await supabase
  .from('resources')
  .select('*')
  .eq('featured', true)
  .order('created_at', { ascending: false })
```

### Track Resource Download
```javascript
const { data, error } = await supabase
  .from('resources')
  .update({
    download_count: downloadCount + 1
  })
  .eq('id', resourceId)
```

## 💌 Messaging API

### Send Message
```javascript
const { data, error } = await supabase
  .from('messages')
  .insert({
    sender_id: senderId,
    recipient_id: recipientId,
    subject: 'About pet adoption',
    content: 'I am interested in adopting...',
    message_type: 'adoption_inquiry',
    related_pet_id: petId
  })
```

### Get User Messages
```javascript
const { data, error } = await supabase
  .from('messages')
  .select(`
    *,
    sender:users!sender_id(name),
    recipient:users!recipient_id(name)
  `)
  .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
  .order('created_at', { ascending: false })
```

## 🔔 Notifications API

### Get User Notifications
```javascript
const { data, error } = await supabase
  .from('notifications')
  .select('*')
  .eq('user_id', userId)
  .eq('is_read', false)
  .order('created_at', { ascending: false })
```

### Mark Notification as Read
```javascript
const { data, error } = await supabase
  .from('notifications')
  .update({
    is_read: true,
    read_at: new Date().toISOString()
  })
  .eq('id', notificationId)
```

## 📊 Real-time Subscriptions

### Subscribe to Pet Updates
```javascript
const subscription = supabase
  .channel('pets')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'pets'
  }, (payload) => {
    console.log('Pet updated:', payload)
    // Update UI accordingly
  })
  .subscribe()
```

### Subscribe to New Messages
```javascript
const subscription = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `recipient_id=eq.${userId}`
  }, (payload) => {
    console.log('New message:', payload.new)
    // Show notification
  })
  .subscribe()
```

## 🔍 Advanced Queries

### Full-text Search
```javascript
const { data, error } = await supabase
  .from('pets')
  .select('*')
  .textSearch('description', searchTerm)
```

### Aggregation Queries
```javascript
const { data, error } = await supabase
  .from('adoption_applications')
  .select('status')
  .eq('applicant_id', userId)
```

### Complex Joins
```javascript
const { data, error } = await supabase
  .from('pets')
  .select(`
    *,
    pet_images!inner(*),
    adoption_applications(
      id,
      status,
      users(name, email)
    )
  `)
  .eq('status', 'available')
```

## ⚠️ Error Handling

### Standard Error Response
```javascript
if (error) {
  console.error('API Error:', error.message)
  // Handle specific error types
  switch (error.code) {
    case 'PGRST116':
      // No rows returned
      break
    case '23505':
      // Unique constraint violation
      break
    default:
      // Generic error handling
  }
}
```

### Common Error Codes
- `PGRST116` - No rows returned
- `23505` - Unique constraint violation
- `23503` - Foreign key constraint violation
- `42501` - Insufficient privileges

## 🚀 Performance Tips

1. **Use Select Specific Columns**: Only fetch needed data
2. **Implement Pagination**: Use `range()` for large datasets
3. **Use Indexes**: Ensure proper database indexing
4. **Cache Results**: Implement client-side caching
5. **Batch Operations**: Group multiple operations when possible

This API documentation covers all major endpoints and operations available in the Zoomies & Snuggles platform.
# Zoomies & Snuggles - Comprehensive Database Schema

## Business Context & Requirements

The Zoomies & Snuggles platform is a comprehensive pet adoption and foster care system serving Rajkot, Gujarat. The system manages:

- **User Management**: Multiple user types (adopters, foster parents, volunteers, organizations)
- **Pet Management**: Pet profiles, medical records, adoption status tracking
- **Adoption Process**: Applications, screening, approvals, and placements
- **Foster Care**: Foster applications, placements, and support
- **Community Features**: Forums, events, success stories
- **Resource Management**: Educational content, guides, videos
- **Communication**: Messages, notifications, support tickets
- **Administrative**: User management, reporting, analytics

---

## Core Database Tables

### 1. Users Table
**Purpose**: Central user management for all platform users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    location VARCHAR(100),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('adopter', 'foster', 'volunteer', 'organization', 'admin')),
    bio TEXT,
    profile_image_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_location ON users(location);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 2. User Profiles Table
**Purpose**: Extended profile information specific to user types

```sql
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_level VARCHAR(20) CHECK (experience_level IN ('beginner', 'intermediate', 'experienced')),
    housing_type VARCHAR(30) CHECK (housing_type IN ('apartment', 'house', 'villa', 'other')),
    has_yard BOOLEAN DEFAULT FALSE,
    has_other_pets BOOLEAN DEFAULT FALSE,
    other_pets_details TEXT,
    availability VARCHAR(20) CHECK (availability IN ('full-time', 'part-time', 'weekends', 'flexible')),
    preferred_pet_size VARCHAR(20) CHECK (preferred_pet_size IN ('small', 'medium', 'large', 'any')),
    preferred_pet_age VARCHAR(20) CHECK (preferred_pet_age IN ('puppy', 'adult', 'senior', 'any')),
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    references TEXT,
    background_check_status VARCHAR(20) DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_housing_type ON user_profiles(housing_type);
```

### 3. Organizations Table
**Purpose**: Partner organizations and rescue groups

```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    organization_type VARCHAR(30) CHECK (organization_type IN ('rescue', 'shelter', 'veterinary', 'partner')),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    website_url VARCHAR(500),
    license_number VARCHAR(100),
    capacity INTEGER DEFAULT 0,
    specialization TEXT, -- e.g., "dogs", "cats", "medical care"
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'suspended')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_organizations_type ON organizations(organization_type);
CREATE INDEX idx_organizations_status ON organizations(verification_status);
```

### 4. Pets Table
**Purpose**: Central pet information and status tracking

```sql
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    species VARCHAR(30) NOT NULL CHECK (species IN ('dog', 'cat', 'rabbit', 'bird', 'other')),
    breed VARCHAR(100),
    age_years INTEGER,
    age_months INTEGER,
    size VARCHAR(20) CHECK (size IN ('small', 'medium', 'large')),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    color VARCHAR(100),
    weight_kg DECIMAL(5,2),
    microchip_id VARCHAR(50) UNIQUE,
    description TEXT NOT NULL,
    personality_traits TEXT,
    special_needs TEXT,
    medical_conditions TEXT,
    behavioral_notes TEXT,
    energy_level VARCHAR(20) CHECK (energy_level IN ('low', 'moderate', 'high')),
    good_with_kids BOOLEAN,
    good_with_pets BOOLEAN,
    good_with_cats BOOLEAN,
    good_with_dogs BOOLEAN,
    house_trained BOOLEAN DEFAULT FALSE,
    vaccinated BOOLEAN DEFAULT FALSE,
    spayed_neutered BOOLEAN DEFAULT FALSE,
    vaccination_date DATE,
    last_vet_visit DATE,
    adoption_fee DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted', 'fostered', 'medical_hold', 'unavailable')),
    intake_date DATE NOT NULL,
    intake_reason TEXT,
    source_organization_id UUID REFERENCES organizations(id),
    current_location VARCHAR(100),
    is_urgent BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_size ON pets(size);
CREATE INDEX idx_pets_featured ON pets(featured);
CREATE INDEX idx_pets_urgent ON pets(is_urgent);
CREATE INDEX idx_pets_intake_date ON pets(intake_date);
```

### 5. Pet Images Table
**Purpose**: Multiple images per pet with ordering

```sql
CREATE TABLE pet_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_pet_images_pet_id ON pet_images(pet_id);
CREATE INDEX idx_pet_images_primary ON pet_images(is_primary);
CREATE UNIQUE INDEX idx_pet_images_primary_unique ON pet_images(pet_id) WHERE is_primary = TRUE;
```

### 6. Adoption Applications Table
**Purpose**: Track adoption application process

```sql
CREATE TABLE adoption_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id),
    applicant_id UUID NOT NULL REFERENCES users(id),
    application_type VARCHAR(20) DEFAULT 'adoption' CHECK (application_type IN ('adoption', 'foster')),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected', 'withdrawn', 'completed')),
    priority_level VARCHAR(20) DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
    
    -- Application Details
    reason_for_adoption TEXT,
    previous_pet_experience TEXT,
    living_situation TEXT,
    work_schedule TEXT,
    pet_care_plan TEXT,
    veterinarian_info TEXT,
    
    -- Review Process
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    interview_scheduled_at TIMESTAMPTZ,
    interview_completed_at TIMESTAMPTZ,
    home_visit_scheduled_at TIMESTAMPTZ,
    home_visit_completed_at TIMESTAMPTZ,
    
    -- Decision
    decision_date TIMESTAMPTZ,
    decision_reason TEXT,
    
    -- Completion
    adoption_date DATE,
    adoption_fee_paid DECIMAL(10,2),
    contract_signed BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_adoption_applications_pet_id ON adoption_applications(pet_id);
CREATE INDEX idx_adoption_applications_applicant_id ON adoption_applications(applicant_id);
CREATE INDEX idx_adoption_applications_status ON adoption_applications(status);
CREATE INDEX idx_adoption_applications_created_at ON adoption_applications(created_at);
```

### 7. Foster Placements Table
**Purpose**: Track foster care placements and history

```sql
CREATE TABLE foster_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id),
    foster_parent_id UUID NOT NULL REFERENCES users(id),
    foster_type VARCHAR(30) CHECK (foster_type IN ('emergency', 'medical', 'puppy_kitten', 'long_term', 'respite')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'terminated', 'transferred')),
    
    -- Placement Details
    start_date DATE NOT NULL,
    expected_end_date DATE,
    actual_end_date DATE,
    placement_reason TEXT,
    special_instructions TEXT,
    
    -- Support and Monitoring
    weekly_check_ins BOOLEAN DEFAULT TRUE,
    emergency_contact_provided BOOLEAN DEFAULT FALSE,
    supplies_provided BOOLEAN DEFAULT FALSE,
    medical_care_covered BOOLEAN DEFAULT TRUE,
    
    -- Completion
    completion_reason TEXT,
    success_rating INTEGER CHECK (success_rating BETWEEN 1 AND 5),
    foster_feedback TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_foster_placements_pet_id ON foster_placements(pet_id);
CREATE INDEX idx_foster_placements_foster_parent_id ON foster_placements(foster_parent_id);
CREATE INDEX idx_foster_placements_status ON foster_placements(status);
CREATE INDEX idx_foster_placements_start_date ON foster_placements(start_date);
```

### 8. Medical Records Table
**Purpose**: Comprehensive pet medical history

```sql
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    record_type VARCHAR(30) CHECK (record_type IN ('vaccination', 'checkup', 'treatment', 'surgery', 'emergency', 'medication')),
    visit_date DATE NOT NULL,
    veterinarian_name VARCHAR(100),
    clinic_name VARCHAR(200),
    
    -- Medical Details
    diagnosis TEXT,
    treatment_provided TEXT,
    medications_prescribed TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    
    -- Vaccination Specific
    vaccine_type VARCHAR(100),
    vaccine_batch_number VARCHAR(50),
    next_due_date DATE,
    
    -- Costs
    cost DECIMAL(10,2),
    paid_by VARCHAR(20) CHECK (paid_by IN ('organization', 'foster', 'adopter', 'donor')),
    
    notes TEXT,
    attachments JSONB, -- Store file URLs and metadata
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_medical_records_pet_id ON medical_records(pet_id);
CREATE INDEX idx_medical_records_type ON medical_records(record_type);
CREATE INDEX idx_medical_records_visit_date ON medical_records(visit_date);
CREATE INDEX idx_medical_records_follow_up ON medical_records(follow_up_required, follow_up_date);
```

### 9. Events Table
**Purpose**: Community events and workshops

```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(30) CHECK (event_type IN ('adoption_drive', 'workshop', 'fundraiser', 'community_meet', 'training', 'volunteer_orientation')),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'ongoing', 'completed', 'cancelled')),
    
    -- Event Details
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    location VARCHAR(200),
    address TEXT,
    max_attendees INTEGER,
    current_attendees INTEGER DEFAULT 0,
    registration_required BOOLEAN DEFAULT TRUE,
    registration_deadline TIMESTAMPTZ,
    
    -- Event Content
    agenda TEXT,
    requirements TEXT,
    what_to_bring TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    
    -- Media
    featured_image_url VARCHAR(500),
    additional_images JSONB,
    
    -- Organization
    organized_by UUID REFERENCES users(id),
    partner_organization_id UUID REFERENCES organizations(id),
    
    -- Costs
    registration_fee DECIMAL(10,2) DEFAULT 0,
    is_free BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_location ON events(location);
```

### 10. Event Registrations Table
**Purpose**: Track event attendance and registrations

```sql
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    registration_status VARCHAR(20) DEFAULT 'registered' CHECK (registration_status IN ('registered', 'confirmed', 'attended', 'no_show', 'cancelled')),
    
    -- Registration Details
    attendees_count INTEGER DEFAULT 1,
    dietary_restrictions TEXT,
    special_requests TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    
    -- Payment (if applicable)
    payment_status VARCHAR(20) DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'paid', 'refunded')),
    payment_amount DECIMAL(10,2),
    payment_date TIMESTAMPTZ,
    
    -- Attendance
    checked_in_at TIMESTAMPTZ,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments TEXT,
    
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(event_id, user_id)
);

-- Indexes
CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(registration_status);
```

### 11. Community Posts Table
**Purpose**: Forum posts and community discussions

```sql
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(300) NOT NULL,
    content TEXT NOT NULL,
    post_type VARCHAR(30) DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'success_story', 'announcement', 'resource_share')),
    category VARCHAR(50) CHECK (category IN ('general', 'adoption_stories', 'foster_care', 'training_tips', 'health_advice', 'events', 'lost_found')),
    
    -- Content Details
    featured_image_url VARCHAR(500),
    tags TEXT[], -- Array of tags
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Moderation
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderated_by UUID REFERENCES users(id),
    moderation_reason TEXT,
    
    -- SEO
    slug VARCHAR(300) UNIQUE,
    meta_description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_type ON community_posts(post_type);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at);
CREATE INDEX idx_community_posts_pinned ON community_posts(is_pinned);
CREATE INDEX idx_community_posts_tags ON community_posts USING GIN(tags);
```

### 12. Post Replies Table
**Purpose**: Replies and comments on community posts

```sql
CREATE TABLE post_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES post_replies(id), -- For nested replies
    author_id UUID NOT NULL REFERENCES users(id),
    content TEXT NOT NULL,
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    
    -- Moderation
    moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected', 'flagged')),
    moderated_by UUID REFERENCES users(id),
    moderation_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_post_replies_post_id ON post_replies(post_id);
CREATE INDEX idx_post_replies_author_id ON post_replies(author_id);
CREATE INDEX idx_post_replies_parent_id ON post_replies(parent_reply_id);
CREATE INDEX idx_post_replies_created_at ON post_replies(created_at);
```

### 13. Resources Table
**Purpose**: Educational content and resources

```sql
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    resource_type VARCHAR(30) CHECK (resource_type IN ('guide', 'video', 'article', 'checklist', 'template', 'infographic')),
    category VARCHAR(50) CHECK (category IN ('pet_care', 'health', 'training', 'safety', 'nutrition', 'behavior', 'adoption_prep')),
    format VARCHAR(20) CHECK (format IN ('pdf', 'video', 'html', 'external_link')),
    
    -- Content
    content_url VARCHAR(500),
    file_size_mb DECIMAL(8,2),
    duration_minutes INTEGER, -- For videos
    reading_time_minutes INTEGER, -- For articles
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Metadata
    author_name VARCHAR(100),
    author_credentials TEXT,
    publication_date DATE,
    last_reviewed_date DATE,
    version VARCHAR(20) DEFAULT '1.0',
    
    -- Engagement
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    
    -- Organization
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    
    -- SEO
    slug VARCHAR(300) UNIQUE,
    meta_description TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_featured ON resources(featured);
CREATE INDEX idx_resources_tags ON resources USING GIN(tags);
CREATE INDEX idx_resources_rating ON resources(rating_average);
```

### 14. Messages Table
**Purpose**: Direct messaging between users

```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID NOT NULL REFERENCES users(id),
    subject VARCHAR(200),
    content TEXT NOT NULL,
    message_type VARCHAR(30) DEFAULT 'direct' CHECK (message_type IN ('direct', 'adoption_inquiry', 'foster_inquiry', 'support_request')),
    
    -- Related Context
    related_pet_id UUID REFERENCES pets(id),
    related_application_id UUID REFERENCES adoption_applications(id),
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    is_archived BOOLEAN DEFAULT FALSE,
    is_deleted_by_sender BOOLEAN DEFAULT FALSE,
    is_deleted_by_recipient BOOLEAN DEFAULT FALSE,
    
    -- Attachments
    attachments JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_unread ON messages(recipient_id, is_read) WHERE is_read = FALSE;
```

### 15. Notifications Table
**Purpose**: System notifications and alerts

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    notification_type VARCHAR(50) CHECK (notification_type IN (
        'application_status', 'new_message', 'event_reminder', 'pet_update', 
        'foster_request', 'system_announcement', 'payment_reminder', 'medical_reminder'
    )),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    
    -- Related Context
    related_pet_id UUID REFERENCES pets(id),
    related_application_id UUID REFERENCES adoption_applications(id),
    related_event_id UUID REFERENCES events(id),
    related_user_id UUID REFERENCES users(id),
    
    -- Delivery
    delivery_method VARCHAR(20) DEFAULT 'in_app' CHECK (delivery_method IN ('in_app', 'email', 'sms', 'push')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    -- Scheduling
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    
    -- Actions
    action_url VARCHAR(500),
    action_text VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_for) WHERE scheduled_for IS NOT NULL;
```

### 16. Donations Table
**Purpose**: Track donations and fundraising

```sql
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES users(id), -- NULL for anonymous donations
    donor_name VARCHAR(100), -- For anonymous or non-user donations
    donor_email VARCHAR(255),
    
    -- Donation Details
    amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    donation_type VARCHAR(30) CHECK (donation_type IN ('one_time', 'monthly', 'annual', 'memorial', 'honor')),
    purpose VARCHAR(50) CHECK (purpose IN ('general', 'medical_care', 'food_supplies', 'facility_maintenance', 'emergency_fund')),
    
    -- Dedication
    in_memory_of VARCHAR(100),
    in_honor_of VARCHAR(100),
    dedication_message TEXT,
    
    -- Payment
    payment_method VARCHAR(30),
    payment_reference VARCHAR(100),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMPTZ,
    
    -- Tax and Receipt
    is_tax_deductible BOOLEAN DEFAULT TRUE,
    receipt_sent BOOLEAN DEFAULT FALSE,
    receipt_sent_at TIMESTAMPTZ,
    
    -- Anonymous
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_donations_donor_id ON donations(donor_id);
CREATE INDEX idx_donations_amount ON donations(amount);
CREATE INDEX idx_donations_payment_status ON donations(payment_status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
```

### 17. Volunteers Table
**Purpose**: Volunteer management and scheduling

```sql
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    volunteer_type VARCHAR(30) CHECK (volunteer_type IN ('general', 'transport', 'events', 'admin', 'medical_support', 'foster_support')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_hold', 'terminated')),
    
    -- Availability
    available_days TEXT[], -- ['monday', 'tuesday', etc.]
    available_hours VARCHAR(50), -- e.g., "9AM-5PM"
    max_hours_per_week INTEGER,
    
    -- Skills and Preferences
    skills TEXT[],
    certifications TEXT[],
    languages TEXT[],
    transportation_available BOOLEAN DEFAULT FALSE,
    
    -- Background Check
    background_check_status VARCHAR(20) DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'approved', 'rejected')),
    background_check_date DATE,
    
    -- Training
    orientation_completed BOOLEAN DEFAULT FALSE,
    orientation_date DATE,
    training_completed BOOLEAN DEFAULT FALSE,
    training_date DATE,
    
    -- Performance
    hours_contributed INTEGER DEFAULT 0,
    events_participated INTEGER DEFAULT 0,
    rating_average DECIMAL(3,2) DEFAULT 0,
    
    start_date DATE NOT NULL,
    end_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_volunteers_user_id ON volunteers(user_id);
CREATE INDEX idx_volunteers_type ON volunteers(volunteer_type);
CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_skills ON volunteers USING GIN(skills);
```

### 18. Audit Logs Table
**Purpose**: Track all system changes for compliance and debugging

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_id UUID REFERENCES users(id),
    user_ip_address INET,
    user_agent TEXT,
    
    -- Change Details
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- Context
    reason TEXT,
    session_id VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

---

## Row Level Security (RLS) Policies

### Users Table Policies
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        )
    );
```

### Pets Table Policies
```sql
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Everyone can read available pets
CREATE POLICY "Anyone can read available pets" ON pets
    FOR SELECT USING (status = 'available');

-- Organizations can manage their pets
CREATE POLICY "Organizations can manage their pets" ON pets
    FOR ALL USING (
        source_organization_id IN (
            SELECT id FROM organizations 
            WHERE id IN (
                SELECT organization_id FROM user_organizations 
                WHERE user_id = auth.uid()
            )
        )
    );
```

### Adoption Applications Policies
```sql
ALTER TABLE adoption_applications ENABLE ROW LEVEL SECURITY;

-- Users can read their own applications
CREATE POLICY "Users can read own applications" ON adoption_applications
    FOR SELECT USING (applicant_id = auth.uid());

-- Users can create applications
CREATE POLICY "Users can create applications" ON adoption_applications
    FOR INSERT WITH CHECK (applicant_id = auth.uid());

-- Staff can read all applications
CREATE POLICY "Staff can read all applications" ON adoption_applications
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type IN ('admin', 'organization')
        )
    );
```

---

## Database Functions and Triggers

### Update Timestamps Function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ... (apply to all relevant tables)
```

### Audit Log Trigger Function
```sql
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_pets AFTER INSERT OR UPDATE OR DELETE ON pets
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

---

## Data Validation Rules

### Email Validation
```sql
ALTER TABLE users ADD CONSTRAINT valid_email 
    CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

### Phone Number Validation
```sql
ALTER TABLE users ADD CONSTRAINT valid_phone 
    CHECK (phone IS NULL OR phone ~* '^\+?[1-9]\d{1,14}$');
```

### Age Validation for Pets
```sql
ALTER TABLE pets ADD CONSTRAINT valid_age 
    CHECK (age_years >= 0 AND age_years <= 30 AND age_months >= 0 AND age_months <= 11);
```

---

## Performance Optimization

### Materialized Views for Analytics
```sql
-- Popular pets view
CREATE MATERIALIZED VIEW popular_pets AS
SELECT 
    p.id,
    p.name,
    p.species,
    p.breed,
    COUNT(aa.id) as application_count,
    AVG(CASE WHEN aa.status = 'approved' THEN 1.0 ELSE 0.0 END) as approval_rate
FROM pets p
LEFT JOIN adoption_applications aa ON p.id = aa.pet_id
WHERE p.created_at >= NOW() - INTERVAL '6 months'
GROUP BY p.id, p.name, p.species, p.breed
ORDER BY application_count DESC;

-- Refresh daily
CREATE INDEX idx_popular_pets_refresh ON popular_pets(application_count);
```

### Partitioning for Large Tables
```sql
-- Partition audit_logs by month
CREATE TABLE audit_logs_y2024m01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE audit_logs_y2024m02 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

---

## Backup and Maintenance

### Regular Maintenance Tasks
```sql
-- Clean up old audit logs (keep 2 years)
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '2 years';

-- Update statistics
ANALYZE;

-- Reindex if needed
REINDEX DATABASE zoomies_snuggles;
```

This comprehensive schema provides a robust foundation for the Zoomies & Snuggles platform, ensuring data integrity, performance, and scalability while maintaining proper security and audit trails.
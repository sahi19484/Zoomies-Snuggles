# Zoomies & Snuggles Database Schema

## Overview
This document outlines the comprehensive database schema for the Zoomies & Snuggles pet adoption platform. The database is designed to support all aspects of pet rescue operations, from user management to pet placements, community features, and administrative functions.

## Database Design Principles

- **PostgreSQL** as the primary database with support for JSONB, full-text search, and advanced data types
- **Row-level security** for data protection and multi-tenancy
- **Audit logging** for all critical operations
- **Flexible metadata storage** using JSONB fields
- **Optimized indexes** for performance
- **Foreign key constraints** for data integrity

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type user_type_enum NOT NULL,
    status user_status_enum DEFAULT 'active',
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address JSONB,
    profile_image_url TEXT,
    bio TEXT,
    emergency_contact JSONB,
    preferences JSONB,
    verification_status verification_status_enum DEFAULT 'pending',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Pets Table
```sql
CREATE TABLE pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    species species_enum NOT NULL,
    breed VARCHAR(255),
    age_years INTEGER,
    age_months INTEGER,
    size size_enum,
    gender gender_enum NOT NULL,
    color VARCHAR(255),
    weight DECIMAL(5,2),
    microchip_id VARCHAR(50),
    status pet_status_enum DEFAULT 'available',
    intake_date DATE NOT NULL,
    adoption_fee DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT FALSE,
    current_location VARCHAR(255),
    description TEXT,
    personality JSONB,
    medical_notes TEXT,
    care_requirements JSONB,
    good_with_kids BOOLEAN,
    good_with_pets BOOLEAN,
    house_trained BOOLEAN,
    energy_level energy_level_enum,
    special_needs TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Pet Images Table
```sql
CREATE TABLE pet_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Applications Table
```sql
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    application_type application_type_enum NOT NULL,
    status application_status_enum DEFAULT 'submitted',
    priority priority_enum DEFAULT 'normal',
    housing_info JSONB NOT NULL,
    experience JSONB,
    references JSONB,
    why_adopt TEXT,
    review_notes TEXT,
    reviewer_id UUID REFERENCES users(id),
    decision_date TIMESTAMP WITH TIME ZONE,
    decision_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Medical Records Table
```sql
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    record_type medical_record_type_enum NOT NULL,
    date DATE NOT NULL,
    veterinarian VARCHAR(255),
    clinic VARCHAR(255),
    diagnosis TEXT,
    treatment TEXT,
    medications JSONB,
    cost DECIMAL(10,2),
    notes TEXT,
    next_visit_due DATE,
    documents JSONB,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Community Posts Table
```sql
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    category post_category_enum NOT NULL,
    status post_status_enum DEFAULT 'active',
    image_url TEXT,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    moderation_notes TEXT,
    moderated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 7. Events Table
```sql
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    event_type event_type_enum NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location VARCHAR(500),
    address JSONB,
    capacity INTEGER,
    registration_required BOOLEAN DEFAULT TRUE,
    fee DECIMAL(10,2) DEFAULT 0,
    organizer_id UUID REFERENCES users(id),
    status event_status_enum DEFAULT 'scheduled',
    registration_deadline TIMESTAMP WITH TIME ZONE,
    special_requirements TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 8. Event Registrations Table
```sql
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendee_count INTEGER DEFAULT 1,
    emergency_contact JSONB,
    special_requirements TEXT,
    payment_status payment_status_enum DEFAULT 'pending',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    check_in_time TIMESTAMP WITH TIME ZONE,
    status registration_status_enum DEFAULT 'registered',
    UNIQUE(event_id, user_id)
);
```

### 9. Donations Table
```sql
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    donation_type donation_type_enum NOT NULL,
    purpose donation_purpose_enum DEFAULT 'general',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_interval INTERVAL,
    payment_method VARCHAR(100),
    payment_reference VARCHAR(255),
    payment_status payment_status_enum DEFAULT 'pending',
    is_anonymous BOOLEAN DEFAULT FALSE,
    memorial_info JSONB,
    tax_receipt_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### 10. Messages Table
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(500),
    content TEXT NOT NULL,
    message_type message_type_enum DEFAULT 'direct',
    context_type VARCHAR(50),
    context_id UUID,
    read_at TIMESTAMP WITH TIME ZONE,
    archived_by_sender BOOLEAN DEFAULT FALSE,
    archived_by_recipient BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Enum Types

```sql
-- User related enums
CREATE TYPE user_type_enum AS ENUM ('adopter', 'foster', 'volunteer', 'organization', 'admin');
CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');

-- Pet related enums
CREATE TYPE species_enum AS ENUM ('dog', 'cat', 'rabbit', 'bird', 'hamster', 'guinea_pig', 'other');
CREATE TYPE size_enum AS ENUM ('small', 'medium', 'large', 'extra_large');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'unknown');
CREATE TYPE pet_status_enum AS ENUM ('available', 'pending', 'adopted', 'fostered', 'medical_hold', 'unavailable', 'deceased');
CREATE TYPE energy_level_enum AS ENUM ('low', 'moderate', 'high', 'very_high');

-- Application related enums
CREATE TYPE application_type_enum AS ENUM ('adoption', 'foster', 'volunteer');
CREATE TYPE application_status_enum AS ENUM ('submitted', 'under_review', 'approved', 'rejected', 'completed');
CREATE TYPE priority_enum AS ENUM ('low', 'normal', 'high', 'urgent');

-- Medical related enums
CREATE TYPE medical_record_type_enum AS ENUM ('vaccination', 'checkup', 'treatment', 'surgery', 'emergency', 'medication', 'spay_neuter', 'dental');

-- Community related enums
CREATE TYPE post_category_enum AS ENUM ('general', 'success_story', 'question', 'advice', 'announcement', 'foster_support', 'training');
CREATE TYPE post_status_enum AS ENUM ('active', 'archived', 'moderated', 'deleted');

-- Event related enums
CREATE TYPE event_type_enum AS ENUM ('adoption_drive', 'workshop', 'fundraiser', 'community_meet', 'training', 'orientation', 'volunteer_event');
CREATE TYPE event_status_enum AS ENUM ('scheduled', 'cancelled', 'completed', 'postponed');
CREATE TYPE registration_status_enum AS ENUM ('registered', 'cancelled', 'attended', 'no_show');

-- Payment related enums
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE donation_type_enum AS ENUM ('one_time', 'monthly', 'annual');
CREATE TYPE donation_purpose_enum AS ENUM ('general', 'medical', 'food', 'emergency', 'memorial');

-- Message related enums
CREATE TYPE message_type_enum AS ENUM ('direct', 'adoption_inquiry', 'foster_inquiry', 'support_request', 'application_update');
```

## Indexes and Performance Optimization

```sql
-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);

-- Pets indexes
CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_featured ON pets(is_featured);
CREATE INDEX idx_pets_adoption_date ON pets(intake_date);

-- Applications indexes
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_pet ON applications(pet_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(application_type);

-- Events indexes
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);

-- Messages indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- Community posts indexes
CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_category ON community_posts(category);
CREATE INDEX idx_posts_created ON community_posts(created_at);
```

## Security and Row Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Example RLS policies
CREATE POLICY users_own_data ON users
    FOR ALL USING (auth.uid() = id OR auth.user_type() = 'admin');

CREATE POLICY applications_visibility ON applications
    FOR SELECT USING (user_id = auth.uid() OR auth.user_type() IN ('admin', 'organization'));
```

## Triggers and Functions

```sql
-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

This schema provides a robust foundation for the Zoomies & Snuggles platform, supporting all identified features while maintaining data integrity, security, and performance.

-- Zoomies & Snuggles Database Setup Script
-- This script creates the complete database schema for the pet adoption platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create custom enum types
CREATE TYPE user_type_enum AS ENUM ('adopter', 'foster', 'volunteer', 'organization', 'admin');
CREATE TYPE user_status_enum AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE species_enum AS ENUM ('dog', 'cat', 'rabbit', 'bird', 'hamster', 'guinea_pig', 'other');
CREATE TYPE size_enum AS ENUM ('small', 'medium', 'large', 'extra_large');
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'unknown');
CREATE TYPE pet_status_enum AS ENUM ('available', 'pending', 'adopted', 'fostered', 'medical_hold', 'unavailable', 'deceased');
CREATE TYPE energy_level_enum AS ENUM ('low', 'moderate', 'high', 'very_high');
CREATE TYPE application_type_enum AS ENUM ('adoption', 'foster', 'volunteer');
CREATE TYPE application_status_enum AS ENUM ('submitted', 'under_review', 'approved', 'rejected', 'completed');
CREATE TYPE priority_enum AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE medical_record_type_enum AS ENUM ('vaccination', 'checkup', 'treatment', 'surgery', 'emergency', 'medication', 'spay_neuter', 'dental');
CREATE TYPE post_category_enum AS ENUM ('general', 'success_story', 'question', 'advice', 'announcement', 'foster_support', 'training');
CREATE TYPE post_status_enum AS ENUM ('active', 'archived', 'moderated', 'deleted');
CREATE TYPE event_type_enum AS ENUM ('adoption_drive', 'workshop', 'fundraiser', 'community_meet', 'training', 'orientation', 'volunteer_event');
CREATE TYPE event_status_enum AS ENUM ('scheduled', 'cancelled', 'completed', 'postponed');
CREATE TYPE registration_status_enum AS ENUM ('registered', 'cancelled', 'attended', 'no_show');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE donation_type_enum AS ENUM ('one_time', 'monthly', 'annual');
CREATE TYPE donation_purpose_enum AS ENUM ('general', 'medical', 'food', 'emergency', 'memorial');
CREATE TYPE message_type_enum AS ENUM ('direct', 'adoption_inquiry', 'foster_inquiry', 'support_request', 'application_update');

-- 1. Users table
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
    organization_code VARCHAR(50),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pets table
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
    spay_neuter_status BOOLEAN DEFAULT FALSE,
    vaccination_status BOOLEAN DEFAULT FALSE,
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pet images table
CREATE TABLE pet_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pet_id UUID NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Applications table
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
    availability JSONB,
    review_notes TEXT,
    reviewer_id UUID REFERENCES users(id),
    decision_date TIMESTAMP WITH TIME ZONE,
    decision_reason TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Medical records table
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

-- 6. Community posts table
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

-- 7. Post replies table
CREATE TABLE post_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES post_replies(id),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Post likes table
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES post_replies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT like_target_check CHECK (
        (post_id IS NOT NULL AND reply_id IS NULL) OR 
        (post_id IS NULL AND reply_id IS NOT NULL)
    ),
    UNIQUE(post_id, user_id),
    UNIQUE(reply_id, user_id)
);

-- 9. Events table
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

-- 10. Event registrations table
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
    feedback TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(event_id, user_id)
);

-- 11. Donations table
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES users(id),
    donor_name VARCHAR(255),
    donor_email VARCHAR(255),
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

-- 12. Messages table
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

-- 13. Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    context_type VARCHAR(50),
    context_id UUID,
    action_url TEXT,
    read_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    delivery_method VARCHAR(20) DEFAULT 'in_app',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 14. Resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) NOT NULL,
    file_url TEXT,
    external_url TEXT,
    category VARCHAR(100) NOT NULL,
    tags JSONB,
    author_id UUID REFERENCES users(id),
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 15. Volunteer activities table
CREATE TABLE volunteer_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    volunteer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    hours_contributed DECIMAL(5,2),
    event_id UUID REFERENCES events(id),
    pet_id UUID REFERENCES pets(id),
    date DATE NOT NULL,
    supervisor_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 16. Audit log table
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id UUID REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. Settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(100),
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 18. Google Sheets sync log table
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sheet_name VARCHAR(100) NOT NULL,
    operation VARCHAR(50) NOT NULL,
    record_count INTEGER,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    processing_time_ms INTEGER,
    sync_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_pets_status ON pets(status);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_pets_featured ON pets(is_featured);
CREATE INDEX idx_pets_intake_date ON pets(intake_date);

CREATE INDEX idx_pet_images_pet_id ON pet_images(pet_id);
CREATE INDEX idx_pet_images_primary ON pet_images(is_primary) WHERE is_primary = TRUE;

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_pet ON applications(pet_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_type ON applications(application_type);

CREATE INDEX idx_medical_records_pet ON medical_records(pet_id);
CREATE INDEX idx_medical_records_date ON medical_records(date);
CREATE INDEX idx_medical_records_type ON medical_records(record_type);

CREATE INDEX idx_posts_author ON community_posts(author_id);
CREATE INDEX idx_posts_category ON community_posts(category);
CREATE INDEX idx_posts_created ON community_posts(created_at);
CREATE INDEX idx_posts_status ON community_posts(status);

CREATE INDEX idx_post_replies_post ON post_replies(post_id);
CREATE INDEX idx_post_replies_author ON post_replies(author_id);
CREATE INDEX idx_post_replies_parent ON post_replies(parent_reply_id);

CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_status ON events(status);

CREATE INDEX idx_event_registrations_event ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_user ON event_registrations(user_id);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_donations_created ON donations(created_at);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_featured ON resources(is_featured);
CREATE INDEX idx_resources_published ON resources(published_at);

CREATE INDEX idx_volunteer_activities_volunteer ON volunteer_activities(volunteer_id);
CREATE INDEX idx_volunteer_activities_date ON volunteer_activities(date);

CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_record ON audit_log(record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- Full-text search indexes
CREATE INDEX idx_pets_search ON pets USING GIN (to_tsvector('english', name || ' ' || COALESCE(breed, '') || ' ' || COALESCE(description, '')));
CREATE INDEX idx_posts_search ON community_posts USING GIN (to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_events_search ON events USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update post reply counts
CREATE OR REPLACE FUNCTION update_post_reply_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE community_posts 
        SET replies_count = replies_count + 1 
        WHERE id = NEW.post_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE community_posts 
        SET replies_count = replies_count - 1 
        WHERE id = OLD.post_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_post_reply_count_trigger
    AFTER INSERT OR DELETE ON post_replies
    FOR EACH ROW EXECUTE FUNCTION update_post_reply_count();

-- Trigger to update like counts
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.post_id IS NOT NULL THEN
            UPDATE community_posts 
            SET likes_count = likes_count + 1 
            WHERE id = NEW.post_id;
        ELSIF NEW.reply_id IS NOT NULL THEN
            UPDATE post_replies 
            SET likes_count = likes_count + 1 
            WHERE id = NEW.reply_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.post_id IS NOT NULL THEN
            UPDATE community_posts 
            SET likes_count = likes_count - 1 
            WHERE id = OLD.post_id;
        ELSIF OLD.reply_id IS NOT NULL THEN
            UPDATE post_replies 
            SET likes_count = likes_count - 1 
            WHERE id = OLD.reply_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_like_count_trigger
    AFTER INSERT OR DELETE ON post_likes
    FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- Insert default settings
INSERT INTO settings (key, value, description, category, is_public) VALUES
('site_name', '"Zoomies & Snuggles"', 'Organization name', 'general', true),
('contact_email', '"hello@zoomiessnuggles.org"', 'Main contact email', 'general', true),
('contact_phone', '"+91 9484844090"', 'Main contact phone', 'general', true),
('location', '"Rajkot, Gujarat, India"', 'Organization location', 'general', true),
('adoption_fee_min', '500', 'Minimum adoption fee in INR', 'adoption', true),
('adoption_fee_max', '5000', 'Maximum adoption fee in INR', 'adoption', true),
('max_images_per_pet', '10', 'Maximum images allowed per pet', 'pets', false),
('auto_approve_volunteers', 'false', 'Auto-approve volunteer applications', 'applications', false),
('notification_email_enabled', 'true', 'Enable email notifications', 'notifications', false),
('google_sheets_sync_enabled', 'true', 'Enable Google Sheets synchronization', 'integrations', false);

-- Create an admin user (password: admin123)
INSERT INTO users (email, password_hash, user_type, name, status, verification_status) VALUES
('admin@zoomiessnuggles.org', '$2b$10$K7L/1YAQJtUOxhqVBKjk6ue5l8zGkXQJtJrWrEXAMPLE', 'admin', 'System Administrator', 'active', 'verified');

COMMENT ON DATABASE postgres IS 'Zoomies & Snuggles Pet Adoption Platform Database';

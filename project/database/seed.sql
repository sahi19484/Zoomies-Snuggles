-- Seed data for Zoomies & Snuggles Database
-- This script populates the database with sample data for development and testing

-- Insert sample users
INSERT INTO users (id, email, password_hash, user_type, name, phone, address, bio, status, verification_status) VALUES
('123e4567-e89b-12d3-a456-426614174000', 'admin@zoomiessnuggles.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/yS.XhZNuA5xB8x9bW', 'admin', 'System Administrator', '+91 9484844090', '{"street": "123 Pet Street", "city": "Rajkot", "state": "Gujarat", "pincode": "360001"}', 'Passionate about animal welfare and rescue operations.', 'active', 'verified'),

('123e4567-e89b-12d3-a456-426614174001', 'john.doe@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/yS.XhZNuA5xB8x9bW', 'adopter', 'John Doe', '+91 9876543210', '{"street": "456 Garden Road", "city": "Rajkot", "state": "Gujarat", "pincode": "360002"}', 'Dog lover looking for a furry companion.', 'active', 'verified'),

('123e4567-e89b-12d3-a456-426614174002', 'jane.smith@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/yS.XhZNuA5xB8x9bW', 'foster', 'Jane Smith', '+91 9765432109', '{"street": "789 Foster Lane", "city": "Rajkot", "state": "Gujarat", "pincode": "360003"}', 'Experienced foster parent specializing in kittens.', 'active', 'verified'),

('123e4567-e89b-12d3-a456-426614174003', 'volunteer@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/yS.XhZNuA5xB8x9bW', 'volunteer', 'Priya Patel', '+91 9654321098', '{"street": "321 Volunteer Street", "city": "Rajkot", "state": "Gujarat", "pincode": "360004"}', 'Animal rights activist and volunteer coordinator.', 'active', 'verified'),

('123e4567-e89b-12d3-a456-426614174004', 'rescue@shelter.org', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/yS.XhZNuA5xB8x9bW', 'organization', 'Rajkot Animal Shelter', '+91 9543210987', '{"street": "555 Shelter Road", "city": "Rajkot", "state": "Gujarat", "pincode": "360005"}', 'Non-profit animal rescue organization.', 'active', 'verified');

-- Insert sample pets
INSERT INTO pets (id, name, species, breed, age_years, age_months, size, gender, color, weight, status, intake_date, adoption_fee, is_featured, description, personality, good_with_kids, good_with_pets, house_trained, energy_level, added_by) VALUES
('223e4567-e89b-12d3-a456-426614174000', 'Buddy', 'dog', 'Golden Retriever', 3, 6, 'large', 'male', 'Golden', 30.5, 'available', '2024-01-15', 2500.00, true, 'Buddy is a friendly and energetic Golden Retriever who loves playing fetch and swimming. He''s great with children and other dogs.', '{"playfulness": "high", "friendliness": "very_high", "training": "basic", "barking": "moderate"}', true, true, true, 'high', '123e4567-e89b-12d3-a456-426614174000'),

('223e4567-e89b-12d3-a456-426614174001', 'Whiskers', 'cat', 'Persian', 2, 0, 'medium', 'female', 'White', 4.2, 'available', '2024-02-01', 1500.00, true, 'Whiskers is a gentle Persian cat who enjoys quiet afternoons and gentle petting. Perfect for a calm household.', '{"independence": "high", "affection": "moderate", "playfulness": "low", "vocal": "low"}', true, false, true, 'low', '123e4567-e89b-12d3-a456-426614174000'),

('223e4567-e89b-12d3-a456-426614174002', 'Max', 'dog', 'Labrador Mix', 1, 8, 'medium', 'male', 'Black', 22.0, 'available', '2024-03-10', 2000.00, false, 'Max is a young and energetic Labrador mix looking for an active family. He''s still learning basic commands.', '{"playfulness": "very_high", "friendliness": "high", "training": "beginner", "barking": "high"}', true, true, false, 'very_high', '123e4567-e89b-12d3-a456-426614174000'),

('223e4567-e89b-12d3-a456-426614174003', 'Luna', 'cat', 'Domestic Shorthair', 4, 0, 'small', 'female', 'Calico', 3.8, 'fostered', '2024-01-20', 1000.00, false, 'Luna is a sweet calico cat recovering from a minor injury. She''s in foster care and will be available soon.', '{"independence": "moderate", "affection": "high", "playfulness": "moderate", "vocal": "moderate"}', false, true, true, 'moderate', '123e4567-e89b-12d3-a456-426614174000'),

('223e4567-e89b-12d3-a456-426614174004', 'Charlie', 'rabbit', 'Holland Lop', 0, 8, 'small', 'male', 'Brown', 1.5, 'available', '2024-03-05', 800.00, false, 'Charlie is a young Holland Lop rabbit who loves hopping around and eating fresh vegetables.', '{"sociability": "high", "activity": "moderate", "handling": "easy"}', true, true, true, 'moderate', '123e4567-e89b-12d3-a456-426614174000');

-- Insert pet images
INSERT INTO pet_images (pet_id, image_url, is_primary, caption, display_order) VALUES
('223e4567-e89b-12d3-a456-426614174000', 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', true, 'Buddy playing in the park', 1),
('223e4567-e89b-12d3-a456-426614174000', 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg', false, 'Buddy sitting nicely', 2),

('223e4567-e89b-12d3-a456-426614174001', 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg', true, 'Whiskers in her favorite spot', 1),

('223e4567-e89b-12d3-a456-426614174002', 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg', true, 'Max ready for playtime', 1),

('223e4567-e89b-12d3-a456-426614174003', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', true, 'Luna resting comfortably', 1),

('223e4567-e89b-12d3-a456-426614174004', 'https://images.pexels.com/photos/3521622/pexels-photo-3521622.jpeg', true, 'Charlie enjoying his vegetables', 1);

-- Insert sample applications
INSERT INTO applications (id, user_id, pet_id, application_type, status, housing_info, experience, why_adopt, submitted_at) VALUES
('323e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', '223e4567-e89b-12d3-a456-426614174000', 'adoption', 'under_review', '{"type": "house", "yard": true, "size": "large", "pets_allowed": true, "rent": false}', '{"previous_pets": true, "experience_years": 5, "training_knowledge": "basic"}', 'I''ve always wanted a Golden Retriever and Buddy seems perfect for our family.', '2024-03-15 10:30:00+00'),

('323e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002', '223e4567-e89b-12d3-a456-426614174003', 'foster', 'approved', '{"type": "house", "yard": false, "size": "medium", "pets_allowed": true, "rent": false}', '{"previous_pets": true, "experience_years": 8, "foster_experience": true}', 'I specialize in fostering cats that need medical care and recovery time.', '2024-02-20 14:15:00+00');

-- Insert sample medical records
INSERT INTO medical_records (pet_id, record_type, date, veterinarian, clinic, diagnosis, treatment, cost, notes, created_by) VALUES
('223e4567-e89b-12d3-a456-426614174000', 'vaccination', '2024-01-16', 'Dr. Amit Sharma', 'Rajkot Veterinary Clinic', 'Annual vaccinations', 'DHPP and Rabies vaccines administered', 800.00, 'All vaccinations up to date. Next due in 12 months.', '123e4567-e89b-12d3-a456-426614174000'),

('223e4567-e89b-12d3-a456-426614174001', 'spay_neuter', '2024-02-05', 'Dr. Priya Mehta', 'Pet Care Hospital', 'Spay surgery', 'Successful spay surgery completed', 2500.00, 'Recovery went smoothly. Follow-up not needed.', '123e4567-e89b-12d3-a456-426614174000'),

('223e4567-e89b-12d3-a456-426614174003', 'treatment', '2024-01-25', 'Dr. Rajesh Patel', 'Animal Emergency Center', 'Minor laceration on leg', 'Wound cleaned and sutured. Antibiotics prescribed', 1200.00, 'Healing well. Sutures removed after 10 days.', '123e4567-e89b-12d3-a456-426614174000');

-- Insert sample community posts
INSERT INTO community_posts (id, author_id, title, content, category, likes_count, replies_count, views_count, created_at) VALUES
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 'Tips for first-time dog owners?', 'I just adopted my first dog and would love some advice from experienced pet parents. What are the essential things I should know about training, feeding, and general care?', 'question', 5, 3, 45, '2024-03-10 09:00:00+00'),

('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002', 'Fostering success story!', 'I''m so happy to share that Luna, the calico cat I''ve been fostering for the past month, has found her forever home! The new family is wonderful and Luna has already settled in beautifully.', 'success_story', 12, 5, 89, '2024-03-12 16:30:00+00'),

('423e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174003', 'Volunteer orientation this weekend', 'We''re having a volunteer orientation session this Saturday at 10 AM. If you''re interested in helping out with our rescue operations, please join us! We''ll cover basics of animal handling, safety protocols, and various volunteer opportunities.', 'announcement', 8, 2, 67, '2024-03-08 11:45:00+00');

-- Insert sample events
INSERT INTO events (id, title, description, event_type, date, start_time, end_time, location, capacity, fee, organizer_id, created_at) VALUES
('523e4567-e89b-12d3-a456-426614174000', 'Pet Adoption Drive', 'Monthly adoption event featuring dogs and cats ready for their forever homes. Come meet our wonderful pets and find your perfect companion!', 'adoption_drive', '2024-04-15', '10:00:00', '16:00:00', 'Rajkot Municipal Garden', 100, 0.00, '123e4567-e89b-12d3-a456-426614174000', '2024-03-01 12:00:00+00'),

('523e4567-e89b-12d3-a456-426614174001', 'Pet Training Workshop', 'Learn basic training techniques for dogs and cats. Topics include house training, basic commands, and behavioral management.', 'workshop', '2024-04-20', '14:00:00', '17:00:00', 'Community Center Hall', 50, 200.00, '123e4567-e89b-12d3-a456-426614174003', '2024-03-05 14:30:00+00'),

('523e4567-e89b-12d3-a456-426614174002', 'Foster Family Meet & Greet', 'Informal gathering for current and prospective foster families to share experiences and connect with other volunteers.', 'community_meet', '2024-04-25', '17:00:00', '19:00:00', 'Zoomies & Snuggles Office', 30, 0.00, '123e4567-e89b-12d3-a456-426614174002', '2024-03-08 10:15:00+00');

-- Insert event registrations
INSERT INTO event_registrations (event_id, user_id, attendee_count, registration_date, status) VALUES
('523e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 2, '2024-03-20 15:30:00+00', 'registered'),
('523e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', 1, '2024-03-22 11:45:00+00', 'registered'),
('523e4567-e89b-12d3-a456-426614174002', '123e4567-e89b-12d3-a456-426614174002', 1, '2024-03-18 09:20:00+00', 'registered');

-- Insert sample donations
INSERT INTO donations (donor_id, donor_name, donor_email, amount, donation_type, purpose, payment_status, created_at) VALUES
('123e4567-e89b-12d3-a456-426614174001', 'John Doe', 'john.doe@example.com', 1000.00, 'one_time', 'general', 'completed', '2024-03-01 14:20:00+00'),
(NULL, 'Anonymous Donor', NULL, 500.00, 'one_time', 'medical', 'completed', '2024-03-05 16:45:00+00'),
('123e4567-e89b-12d3-a456-426614174002', 'Jane Smith', 'jane.smith@example.com', 2000.00, 'monthly', 'food', 'completed', '2024-02-15 10:30:00+00');

-- Insert sample resources
INSERT INTO resources (title, description, content_type, file_url, category, author_id, published_at, created_at) VALUES
('New Pet Owner Guide', 'Comprehensive guide for first-time pet owners covering basics of pet care, nutrition, and training.', 'pdf', '/resources/new-pet-owner-guide.pdf', 'pet_care', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00'),

('Pet Vaccination Schedule', 'Complete vaccination schedule for dogs and cats with recommended timelines and important notes.', 'pdf', '/resources/pet-vaccination-schedule.pdf', 'health', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00'),

('Emergency First Aid for Pets', 'Essential first aid techniques every pet owner should know for emergency situations.', 'pdf', '/resources/pet-emergency-first-aid.pdf', 'safety', '123e4567-e89b-12d3-a456-426614174000', '2024-01-01 00:00:00+00', '2024-01-01 00:00:00+00');

-- Insert volunteer activities
INSERT INTO volunteer_activities (volunteer_id, activity_type, description, hours_contributed, date, created_at) VALUES
('123e4567-e89b-12d3-a456-426614174003', 'Event Support', 'Helped organize and manage the monthly adoption drive', 6.0, '2024-03-15', '2024-03-16 18:00:00+00'),
('123e4567-e89b-12d3-a456-426614174003', 'Pet Transport', 'Transported rescued dogs from shelter to veterinary clinic', 3.0, '2024-03-10', '2024-03-10 20:30:00+00'),
('123e4567-e89b-12d3-a456-426614174003', 'Administrative', 'Data entry and application processing support', 4.0, '2024-03-08', '2024-03-08 17:15:00+00');

-- Insert sample messages
INSERT INTO messages (sender_id, recipient_id, subject, content, message_type, context_type, context_id, created_at) VALUES
('123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174000', 'Question about Buddy', 'Hi, I submitted an application for Buddy yesterday. Could you tell me what the next steps are in the adoption process?', 'adoption_inquiry', 'pet', '223e4567-e89b-12d3-a456-426614174000', '2024-03-16 10:15:00+00'),

('123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001', 'Re: Question about Buddy', 'Thank you for your interest in Buddy! Your application is currently under review. We''ll contact you within 2-3 business days to schedule a meet and greet.', 'adoption_inquiry', 'pet', '223e4567-e89b-12d3-a456-426614174000', '2024-03-16 14:30:00+00');

-- Update statistics
UPDATE pets SET 
  views_count = FLOOR(RANDOM() * 100) + 20,
  inquiries_count = FLOOR(RANDOM() * 10) + 1
WHERE status = 'available';

-- Add some notifications
INSERT INTO notifications (user_id, title, message, notification_type, context_type, context_id, created_at) VALUES
('123e4567-e89b-12d3-a456-426614174001', 'Application Received', 'Your adoption application for Buddy has been received and is under review.', 'application_update', 'application', '323e4567-e89b-12d3-a456-426614174000', '2024-03-15 10:35:00+00'),

('123e4567-e89b-12d3-a456-426614174002', 'Foster Approval', 'Congratulations! Your foster application has been approved. Welcome to our foster family!', 'application_update', 'application', '323e4567-e89b-12d3-a456-426614174001', '2024-02-21 09:20:00+00');

-- Create some post replies
INSERT INTO post_replies (post_id, author_id, content, created_at) VALUES
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002', 'Congratulations on your new adoption! My top tip would be to establish a routine early on. Dogs thrive on consistency with feeding times, walks, and bedtime.', '2024-03-10 12:30:00+00'),

('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174003', 'Don''t forget about socialization! The more positive experiences your dog has with different people, animals, and environments in the first few months, the better adjusted they''ll be.', '2024-03-10 15:45:00+00'),

('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', 'That''s wonderful news! Luna looked so happy in the photos you shared. Thank you for being such a dedicated foster parent.', '2024-03-12 18:15:00+00');

-- Add some likes
INSERT INTO post_likes (post_id, user_id, created_at) VALUES
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174002', '2024-03-10 11:00:00+00'),
('423e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174003', '2024-03-10 13:20:00+00'),
('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174001', '2024-03-12 16:35:00+00'),
('423e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174003', '2024-03-12 17:10:00+00');

COMMENT ON SCRIPT IS 'Sample data for Zoomies & Snuggles development environment';

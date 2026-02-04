-- This script seeds data without depending on specific user IDs
-- You'll need to manually sign up users first, then seed their data

-- Seed Pets Table (using a placeholder admin UUID - replace with real admin UUID)
-- First, get the admin user ID from your auth.users table and replace below
INSERT INTO pets (creator_id, name, species, breed, description, age, size, gender, location, image, vaccinated, neutered, urgent, created_at, updated_at) 
VALUES
('00000000-0000-0000-0000-000000000000', 'Buddy', 'Dog', 'Golden Retriever', 'Friendly and energetic, loves playing fetch and long walks. Perfect family dog!', '2 years', 'Large', 'Male', 'Rajkot Central', 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg', true, true, false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Luna', 'Cat', 'Persian', 'Gentle and affectionate, perfect for quiet homes. Loves cuddling on the couch.', '1 year', 'Small', 'Female', 'University Road', 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg', true, true, true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Max', 'Dog', 'German Shepherd', 'Loyal and protective, great with children and families. Well-trained and obedient.', '3 years', 'Large', 'Male', 'Morbi Road', 'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg', true, true, false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Mittens', 'Cat', 'Tabby', 'Playful kitten, loves toys and interactive games. Very social and friendly.', '6 months', 'Small', 'Male', 'Kalawad Road', 'https://images.pexels.com/photos/1440498/pexels-photo-1440498.jpeg', false, false, false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Charlie', 'Dog', 'Labrador Mix', 'Sweet rescue dog, needs a patient home. Learns quickly and very loving.', '4 years', 'Medium', 'Male', '150 Feet Ring Road', 'https://images.pexels.com/photos/3213619/pexels-photo-3213619.jpeg', true, true, true, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Bella', 'Dog', 'Cocker Spaniel', 'Energetic and affectionate. Loves swimming and outdoor activities.', '2.5 years', 'Medium', 'Female', 'Rajkot Central', 'https://images.pexels.com/photos/3931603/pexels-photo-3931603.jpeg', true, true, false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Shadow', 'Cat', 'Black Cat', 'Independent but loving, prefers calm environments. Great for single people or couples.', '3 years', 'Medium', 'Male', 'University Road', 'https://images.pexels.com/photos/1548681/pexels-photo-1548681.jpeg', true, true, false, NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Daisy', 'Dog', 'Poodle Mix', 'Small, intelligent, and well-behaved. Excellent for apartment living.', '1.5 years', 'Small', 'Female', 'Morbi Road', 'https://images.pexels.com/photos/1390746/pexels-photo-1390746.jpeg', true, false, false, NOW(), NOW());

-- Seed Events Table
INSERT INTO events (organizer_id, title, description, date, location, created_at, updated_at) 
VALUES
('00000000-0000-0000-0000-000000000000', 'Pet Adoption Drive', 'Join us for our monthly adoption drive where you can meet available pets and find your new family member!', NOW() + INTERVAL '7 days', 'Rajkot Municipal Garden', NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Foster Family Meet & Greet', 'Connect with experienced foster families and learn about the fostering process.', NOW() + INTERVAL '14 days', 'Community Center, University Road', NOW(), NOW()),
('00000000-0000-0000-0000-000000000000', 'Pet Care Workshop', 'Learn essential pet care skills including grooming, nutrition, and health management.', NOW() + INTERVAL '21 days', 'Zoomies & Snuggles Office', NOW(), NOW());

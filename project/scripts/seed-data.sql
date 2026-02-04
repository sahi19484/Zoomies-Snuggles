-- First, disable foreign key checks temporarily
ALTER TABLE pets DISABLE TRIGGER ALL;
ALTER TABLE adoptions DISABLE TRIGGER ALL;
ALTER TABLE foster_applications DISABLE TRIGGER ALL;
ALTER TABLE volunteer_applications DISABLE TRIGGER ALL;
ALTER TABLE favorites DISABLE TRIGGER ALL;
ALTER TABLE posts DISABLE TRIGGER ALL;

-- Seed Users Table with test data
DELETE FROM users WHERE email IN ('admin@zoomies.com', 'priya@example.com', 'arjun@example.com', 'meera@example.com', 'rajesh@example.com');

INSERT INTO users (auth_id, email, name, user_type, phone, location, experience, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@zoomies.com', 'Admin User', 'organization', '9484844090', 'Rajkot Central', 'Founder', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'priya@example.com', 'Priya Patel', 'adopter', '9876543210', 'University Road', NULL, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'arjun@example.com', 'Arjun Shah', 'foster', '9765432109', 'Morbi Road', '5 years', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'meera@example.com', 'Meera Joshi', 'volunteer', '9654321098', 'Kalawad Road', '2 years', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'rajesh@example.com', 'Rajesh Kumar', 'adopter', '9543210987', '150 Feet Ring Road', NULL, NOW(), NOW());

-- Seed Pets Table with test data
DELETE FROM pets WHERE name IN ('Buddy', 'Luna', 'Max', 'Mittens', 'Charlie', 'Bella', 'Shadow', 'Daisy');

INSERT INTO pets (creator_id, name, species, breed, description, age, size, gender, location, image, vaccinated, neutered, urgent, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Buddy', 'Dog', 'Golden Retriever', 'Friendly and energetic, loves playing fetch and long walks. Perfect family dog!', '2 years', 'Large', 'Male', 'Rajkot Central', 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg', true, true, false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Luna', 'Cat', 'Persian', 'Gentle and affectionate, perfect for quiet homes. Loves cuddling on the couch.', '1 year', 'Small', 'Female', 'University Road', 'https://images.pexels.com/photos/2071873/pexels-photo-2071873.jpeg', true, true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Max', 'Dog', 'German Shepherd', 'Loyal and protective, great with children and families. Well-trained and obedient.', '3 years', 'Large', 'Male', 'Morbi Road', 'https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg', true, true, false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Mittens', 'Cat', 'Tabby', 'Playful kitten, loves toys and interactive games. Very social and friendly.', '6 months', 'Small', 'Male', 'Kalawad Road', 'https://images.pexels.com/photos/1440498/pexels-photo-1440498.jpeg', false, false, false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Charlie', 'Dog', 'Labrador Mix', 'Sweet rescue dog, needs a patient home. Learns quickly and very loving.', '4 years', 'Medium', 'Male', '150 Feet Ring Road', 'https://images.pexels.com/photos/3213619/pexels-photo-3213619.jpeg', true, true, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Bella', 'Dog', 'Cocker Spaniel', 'Energetic and affectionate. Loves swimming and outdoor activities.', '2.5 years', 'Medium', 'Female', 'Rajkot Central', 'https://images.pexels.com/photos/3931603/pexels-photo-3931603.jpeg', true, true, false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Shadow', 'Cat', 'Black Cat', 'Independent but loving, prefers calm environments. Great for single people or couples.', '3 years', 'Medium', 'Male', 'University Road', 'https://images.pexels.com/photos/1548681/pexels-photo-1548681.jpeg', true, true, false, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Daisy', 'Dog', 'Poodle Mix', 'Small, intelligent, and well-behaved. Excellent for apartment living.', '1.5 years', 'Small', 'Female', 'Morbi Road', 'https://images.pexels.com/photos/1390746/pexels-photo-1390746.jpeg', true, false, false, NOW(), NOW());

-- Seed Events Table
DELETE FROM events WHERE title IN ('Pet Adoption Drive', 'Foster Family Meet & Greet', 'Pet Care Workshop');

INSERT INTO events (organizer_id, title, description, date, location, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Pet Adoption Drive', 'Join us for our monthly adoption drive where you can meet available pets and find your new family member!', NOW() + INTERVAL '7 days', 'Rajkot Municipal Garden', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Foster Family Meet & Greet', 'Connect with experienced foster families and learn about the fostering process.', NOW() + INTERVAL '14 days', 'Community Center, University Road', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Pet Care Workshop', 'Learn essential pet care skills including grooming, nutrition, and health management.', NOW() + INTERVAL '21 days', 'Zoomies & Snuggles Office', NOW(), NOW());

-- Seed Foster Applications
DELETE FROM foster_applications WHERE phone IN ('9765432109', '9543210987');

INSERT INTO foster_applications (user_id, experience, phone, location, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', '5 years of fostering experience', '9765432109', 'Morbi Road', 'approved', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Interested in fostering', '9543210987', '150 Feet Ring Road', 'pending', NOW(), NOW());

-- Seed Volunteer Applications
DELETE FROM volunteer_applications WHERE user_id IN ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO volunteer_applications (user_id, status, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440004', 'approved', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'pending', NOW(), NOW());

-- Seed Posts (Community)
DELETE FROM posts WHERE user_id IN ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004');

INSERT INTO posts (user_id, content, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'I just adopted Buddy and he is the sweetest dog! Thanks to the Zoomies & Snuggles team for helping me find my perfect companion!', NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Tips for fostering puppies: Be patient, establish a routine, and lots of love! Currently fostering 3 adorable pups.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440004', 'The pet care workshop was amazing! Learned so much about proper nutrition for different pet types.', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours');

-- Re-enable foreign key checks
ALTER TABLE pets ENABLE TRIGGER ALL;
ALTER TABLE adoptions ENABLE TRIGGER ALL;
ALTER TABLE foster_applications ENABLE TRIGGER ALL;
ALTER TABLE volunteer_applications ENABLE TRIGGER ALL;
ALTER TABLE favorites ENABLE TRIGGER ALL;
ALTER TABLE posts ENABLE TRIGGER ALL;

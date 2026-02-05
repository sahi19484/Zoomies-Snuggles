-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for pets table
CREATE TRIGGER update_pets_updated_at
BEFORE UPDATE ON pets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for adoptions table
CREATE TRIGGER update_adoptions_updated_at
BEFORE UPDATE ON adoptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for foster_applications table
CREATE TRIGGER update_foster_applications_updated_at
BEFORE UPDATE ON foster_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for volunteer_applications table
CREATE TRIGGER update_volunteer_applications_updated_at
BEFORE UPDATE ON volunteer_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for posts table
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for comments table
CREATE TRIGGER update_comments_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for events table
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Function to get pet adoption status
CREATE OR REPLACE FUNCTION get_pet_adoption_status(pet_id UUID)
RETURNS TABLE(status VARCHAR, user_name TEXT, email TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.status,
    u.name,
    u.email
  FROM adoptions a
  JOIN users u ON a.user_id = u.id
  WHERE a.pet_id = pet_id
  ORDER BY a.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Function to count available pets
CREATE OR REPLACE FUNCTION count_available_pets()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM pets p
  WHERE NOT EXISTS (
    SELECT 1 FROM adoptions a
    WHERE a.pet_id = p.id
    AND a.status = 'approved'
  );
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function to get active foster homes
CREATE OR REPLACE FUNCTION get_active_foster_count()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM foster_applications
  WHERE status = 'approved';
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function to get total adoptions this month
CREATE OR REPLACE FUNCTION get_monthly_adoptions()
RETURNS INTEGER AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM adoptions
  WHERE status = 'approved'
  AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW());
  RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Function to get pet statistics by type
CREATE OR REPLACE FUNCTION get_pet_statistics()
RETURNS TABLE(species VARCHAR, total_count BIGINT, available_count BIGINT, adopted_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.species,
    COUNT(p.id)::BIGINT as total_count,
    COUNT(CASE WHEN NOT EXISTS (
      SELECT 1 FROM adoptions a
      WHERE a.pet_id = p.id AND a.status = 'approved'
    ) THEN 1 END)::BIGINT as available_count,
    COUNT(CASE WHEN EXISTS (
      SELECT 1 FROM adoptions a
      WHERE a.pet_id = p.id AND a.status = 'approved'
    ) THEN 1 END)::BIGINT as adopted_count
  FROM pets p
  GROUP BY p.species
  ORDER BY total_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to search pets
CREATE OR REPLACE FUNCTION search_pets(
  search_query TEXT DEFAULT '',
  species_filter VARCHAR DEFAULT '',
  size_filter VARCHAR DEFAULT '',
  location_filter TEXT DEFAULT ''
)
RETURNS TABLE(
  id UUID,
  name TEXT,
  species VARCHAR,
  breed TEXT,
  description TEXT,
  age TEXT,
  size VARCHAR,
  gender VARCHAR,
  location TEXT,
  image TEXT,
  vaccinated BOOLEAN,
  neutered BOOLEAN,
  urgent BOOLEAN,
  creator_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.species,
    p.breed,
    p.description,
    p.age,
    p.size,
    p.gender,
    p.location,
    p.image,
    p.vaccinated,
    p.neutered,
    p.urgent,
    p.creator_id
  FROM pets p
  WHERE 
    (search_query = '' OR 
     p.name ILIKE '%' || search_query || '%' OR 
     p.breed ILIKE '%' || search_query || '%' OR
     p.description ILIKE '%' || search_query || '%')
    AND (species_filter = '' OR p.species = species_filter)
    AND (size_filter = '' OR p.size = size_filter)
    AND (location_filter = '' OR p.location ILIKE '%' || location_filter || '%')
  ORDER BY p.urgent DESC, p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions for these functions
GRANT EXECUTE ON FUNCTION get_pet_adoption_status(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION count_available_pets() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_active_foster_count() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_monthly_adoptions() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_pet_statistics() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_pets(TEXT, VARCHAR, VARCHAR, TEXT) TO anon, authenticated;

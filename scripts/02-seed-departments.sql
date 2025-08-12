-- Seed default departments
INSERT INTO departments (name, description) VALUES
  ('Human Resources', 'Manages employee relations, recruitment, and HR policies'),
  ('Engineering', 'Software development and technical operations'),
  ('Marketing', 'Brand management, advertising, and customer acquisition'),
  ('Sales', 'Revenue generation and customer relationships'),
  ('Finance', 'Financial planning, accounting, and budget management'),
  ('Operations', 'Business operations and process management'),
  ('Customer Support', 'Customer service and technical support')
ON CONFLICT DO NOTHING;

-- Create a default admin user profile (you can modify this)
-- Note: This assumes you have a user with this email already created in Supabase Auth
DO $$
BEGIN
  -- Only insert if the profile doesn't exist
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE email = 'admin@hr4u.com') THEN
    INSERT INTO profiles (id, email, full_name, role) 
    VALUES (
      gen_random_uuid(), 
      'admin@hr4u.com', 
      'System Administrator', 
      'admin'
    );
  END IF;
END $$;

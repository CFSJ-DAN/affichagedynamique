/*
  # Update demo user if exists
  
  Updates the demo user password if it exists, otherwise creates it
*/

-- Update password if user exists, otherwise do nothing
UPDATE auth.users 
SET encrypted_password = crypt('demo123', gen_salt('bf'))
WHERE email = 'demo@example.com';
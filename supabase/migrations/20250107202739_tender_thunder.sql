/*
  # Update RLS policies for anonymous access
  
  1. Changes
    - Update RLS policies to allow anonymous read access
    - Keep write operations restricted to authenticated users
*/

-- Update screens policy
DROP POLICY IF EXISTS "Users can read/write their own screens" ON screens;

CREATE POLICY "Anyone can read screens"
  ON screens
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can modify screens"
  ON screens
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update media_items policy
DROP POLICY IF EXISTS "Users can read/write their own media" ON media_items;

CREATE POLICY "Anyone can read media"
  ON media_items
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can modify media"
  ON media_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update playlists policy
DROP POLICY IF EXISTS "Users can read/write their own playlists" ON playlists;

CREATE POLICY "Anyone can read playlists"
  ON playlists
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can modify playlists"
  ON playlists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update playlist_media policy
DROP POLICY IF EXISTS "Users can read/write their own playlist media" ON playlist_media;

CREATE POLICY "Anyone can read playlist media"
  ON playlist_media
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can modify playlist media"
  ON playlist_media
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update time_slots policy
DROP POLICY IF EXISTS "Users can read/write their own time slots" ON time_slots;

CREATE POLICY "Anyone can read time slots"
  ON time_slots
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can modify time slots"
  ON time_slots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
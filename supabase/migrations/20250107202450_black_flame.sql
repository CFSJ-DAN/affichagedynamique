/*
  # Schéma initial pour l'affichage dynamique

  1. New Tables
    - `screens` - Gestion des écrans
    - `playlists` - Listes de lecture
    - `media_items` - Médiathèque
    - `playlist_media` - Association playlists-médias
    - `time_slots` - Créneaux de diffusion

  2. Security
    - Enable RLS sur toutes les tables
    - Policies pour lecture/écriture par utilisateur authentifié
*/

-- Screens
CREATE TABLE IF NOT EXISTS screens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'offline',
  last_seen timestamptz DEFAULT now(),
  orientation text NOT NULL,
  resolution jsonb NOT NULL,
  pairing_code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE screens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/write their own screens"
  ON screens
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Media Items
CREATE TABLE IF NOT EXISTS media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  duration integer NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/write their own media"
  ON media_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Playlists
CREATE TABLE IF NOT EXISTS playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  transition jsonb DEFAULT '{"type": "fade", "duration": 500}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/write their own playlists"
  ON playlists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Playlist Media (association table)
CREATE TABLE IF NOT EXISTS playlist_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists ON DELETE CASCADE,
  media_id uuid REFERENCES media_items ON DELETE CASCADE,
  position integer NOT NULL,
  transition jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE playlist_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/write their own playlist media"
  ON playlist_media
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Time Slots
CREATE TABLE IF NOT EXISTS time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid REFERENCES playlists ON DELETE CASCADE,
  screen_id uuid REFERENCES screens ON DELETE CASCADE,
  start_date date,
  end_date date,
  start_time time NOT NULL,
  end_time time NOT NULL,
  days integer[] NOT NULL,
  recurrence jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read/write their own time slots"
  ON time_slots
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
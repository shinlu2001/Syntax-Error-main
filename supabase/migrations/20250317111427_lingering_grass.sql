/*
  # Create tables for scraped data

  1. New Tables
    - `scraped_profiles`
      - `id` (uuid, primary key)
      - `url` (text, unique)
      - `full_name` (text)
      - `current_position` (text)
      - `company` (text)
      - `location` (text)
      - `skills` (text[])
      - `created_at` (timestamp)
      - `last_scraped` (timestamp)
      - `next_scan_date` (timestamp)
      - `scan_interval` (integer)
      - `raw_data` (jsonb)
      - `status` (text)

  2. Security
    - Enable RLS on `scraped_profiles` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS scraped_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  full_name text,
  current_position text,
  company text,
  location text,
  skills text[],
  created_at timestamptz DEFAULT now(),
  last_scraped timestamptz DEFAULT now(),
  next_scan_date timestamptz,
  scan_interval integer DEFAULT 7, -- days
  raw_data jsonb,
  status text DEFAULT 'pending',
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE scraped_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own scraped profiles"
  ON scraped_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scraped profiles"
  ON scraped_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scraped profiles"
  ON scraped_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
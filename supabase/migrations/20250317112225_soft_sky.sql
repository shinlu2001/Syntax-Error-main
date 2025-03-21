/*
  # Create company data table

  1. New Tables
    - `company_data`
      - `id` (uuid, primary key)
      - `domain` (text, unique)
      - `name` (text)
      - `industry` (text)
      - `size` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `last_updated` (timestamp)
      - `metadata` (jsonb)

  2. Security
    - Enable RLS on `company_data` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS company_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text UNIQUE NOT NULL,
  name text,
  industry text,
  size text,
  status text DEFAULT 'pending_review',
  created_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  metadata jsonb,
  user_id uuid REFERENCES auth.users(id)
);

ALTER TABLE company_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own company data"
  ON company_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company data"
  ON company_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own company data"
  ON company_data
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
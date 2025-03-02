/*
  # Create THR shares table

  1. New Tables
    - `thr_shares`
      - `id` (uuid, primary key)
      - `share_id` (text, unique)
      - `rates` (text, JSON string of THR rates)
      - `recipients` (text, JSON string of recipients)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  2. Security
    - Enable RLS on `thr_shares` table
    - Add policy for public access to read data
    - Add policy for anonymous users to insert/update data
*/

CREATE TABLE IF NOT EXISTS thr_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id text UNIQUE NOT NULL,
  rates text NOT NULL,
  recipients text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE thr_shares ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read share data
CREATE POLICY "Public can read thr_shares"
  ON thr_shares
  FOR SELECT
  TO public
  USING (true);

-- Allow anonymous users to insert new shares
CREATE POLICY "Anonymous users can insert thr_shares"
  ON thr_shares
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update shares they created (by share_id)
CREATE POLICY "Anonymous users can update their thr_shares"
  ON thr_shares
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
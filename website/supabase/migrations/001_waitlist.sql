-- Waitlist table for kladeai.com
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  company text,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'website',
  notified boolean DEFAULT false,
  CONSTRAINT waitlist_email_unique UNIQUE (email)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist (created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API route)
CREATE POLICY "Service role full access" ON waitlist
  FOR ALL
  USING (true)
  WITH CHECK (true);

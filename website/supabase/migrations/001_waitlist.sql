-- Waitlist table for kladeai.com email capture
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  company text,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'website',
  notified boolean DEFAULT false
);

-- Index for quick lookups by email
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist (email);

-- Index for admin queries (unnotified signups)
CREATE INDEX IF NOT EXISTS idx_waitlist_notified ON waitlist (notified) WHERE notified = false;

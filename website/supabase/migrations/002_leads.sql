-- Leads table for kladeai.com homepage lead capture form
-- Mirrors the waitlist pattern, but richer payload (name, role, team size, bottleneck)
-- Run via: Supabase Management API POST /v1/projects/{ref}/database/query

CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  company text NOT NULL,
  email text NOT NULL,
  team_size text NOT NULL,
  role text NOT NULL,
  bottleneck text NOT NULL,
  created_at timestamptz DEFAULT now(),
  source text DEFAULT 'website-v2',
  notified boolean DEFAULT false,
  client_ip text,
  user_agent text
);

-- Indexes for lookup and sorting
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_company ON leads (lower(company));

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for API route inserts)
CREATE POLICY "Service role full access" ON leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- THE GRAVITY STUDIOS CLIENT PORTAL & ADMIN DATABASE SCHEMA

-- 1. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  project_status TEXT DEFAULT 'In Production', -- 'In Production', 'Under Review', 'Completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PROJECT ASSETS & DRIVE LINKS TABLE
CREATE TABLE IF NOT EXISTS project_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  link_type TEXT NOT NULL, -- 'google_drive', 'frame_io', 'figma', 'youtube', 'other'
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. GENERATED DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  doc_type TEXT NOT NULL, -- 'proposal', 'brief', 'contract', 'invoice'
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status TEXT DEFAULT 'Published', -- 'Draft', 'Published', 'Signed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

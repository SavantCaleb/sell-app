-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table (minimal for now)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow users to read all listings
CREATE POLICY "Listings are viewable by everyone" ON listings
  FOR SELECT USING (true);

-- Allow users to insert their own listings
CREATE POLICY "Users can insert their own listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Users can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Users can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for listings
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT DO NOTHING;

-- Allow anyone to view listing files
CREATE POLICY "Listing files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'listings');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload listing files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listings' 
    AND auth.role() = 'authenticated'
  );

-- Create indexes for better performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_created_at ON listings(created_at DESC);
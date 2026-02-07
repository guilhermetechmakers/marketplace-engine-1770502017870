-- create_listing_page table
CREATE TABLE IF NOT EXISTS create_listing_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE create_listing_page ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "create_listing_page_read_own" ON create_listing_page
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "create_listing_page_insert_own" ON create_listing_page
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "create_listing_page_update_own" ON create_listing_page
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "create_listing_page_delete_own" ON create_listing_page
  FOR DELETE USING (auth.uid() = user_id);

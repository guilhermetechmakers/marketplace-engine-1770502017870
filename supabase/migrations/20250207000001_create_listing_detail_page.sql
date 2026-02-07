-- listing_detail_page table
CREATE TABLE IF NOT EXISTS listing_detail_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE listing_detail_page ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "listing_detail_page_read_own" ON listing_detail_page
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "listing_detail_page_insert_own" ON listing_detail_page
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "listing_detail_page_update_own" ON listing_detail_page
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "listing_detail_page_delete_own" ON listing_detail_page
  FOR DELETE USING (auth.uid() = user_id);

-- checkout_payment_page table (valid identifier, no slash)
CREATE TABLE IF NOT EXISTS checkout_payment_page (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE checkout_payment_page ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "checkout_payment_page_read_own" ON checkout_payment_page
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "checkout_payment_page_insert_own" ON checkout_payment_page
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "checkout_payment_page_update_own" ON checkout_payment_page
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "checkout_payment_page_delete_own" ON checkout_payment_page
  FOR DELETE USING (auth.uid() = user_id);

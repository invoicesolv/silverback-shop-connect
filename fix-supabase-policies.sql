-- ========================================
-- Fix RLS Policies for Quote Requests and Storage
-- Run these commands in your Supabase SQL Editor
-- ========================================

-- 1. Allow anyone to insert quote requests
CREATE POLICY "Anyone can insert quote requests"
ON quote_requests
FOR INSERT
TO public
WITH CHECK (true);

-- 2. Allow anyone to select their own quote requests (optional, for future use)
CREATE POLICY "Users can view quote requests"
ON quote_requests
FOR SELECT
TO public
USING (true);

-- 3. Storage policies for design-files bucket
-- Allow anyone to upload files to the quotes folder
INSERT INTO storage.policies (name, bucket_id, policy_for, definition)
VALUES (
    'Anyone can upload quote files',
    'design-files',
    'INSERT',
    'bucket_id = ''design-files'' AND (storage.foldername(name))[1] = ''quotes'''
);

-- Allow anyone to view uploaded quote files
INSERT INTO storage.policies (name, bucket_id, policy_for, definition)
VALUES (
    'Anyone can view quote files',
    'design-files',
    'SELECT',
    'bucket_id = ''design-files'' AND (storage.foldername(name))[1] = ''quotes'''
);

-- 4. Newsletter subscriptions - allow anyone to insert profiles for newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
ON profiles
FOR INSERT
TO public
WITH CHECK (true);

-- Allow upsert on profiles for newsletter (in case email already exists)
CREATE POLICY "Anyone can upsert newsletter subscription"
ON profiles
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- ========================================
-- Alternative approach if the above doesn't work:
-- Disable RLS temporarily for testing (NOT RECOMMENDED FOR PRODUCTION)
-- ========================================

-- UNCOMMENT ONLY FOR TESTING - NOT RECOMMENDED FOR PRODUCTION
-- ALTER TABLE quote_requests DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- ========================================
-- To check existing policies, run:
-- ========================================
-- SELECT * FROM pg_policies WHERE tablename = 'quote_requests';
-- SELECT * FROM pg_policies WHERE tablename = 'profiles';
-- SELECT * FROM storage.policies WHERE bucket_id = 'design-files';

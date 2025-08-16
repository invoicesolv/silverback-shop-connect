-- Create function to check if user owns a file (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.user_owns_file(file_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN file_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- First drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete design files" ON storage.objects;

-- Create new unique storage policies
CREATE POLICY "design_files_upload_policy" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "design_files_select_policy" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "design_files_update_policy" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "design_files_delete_policy" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update design_files table policies
DROP POLICY IF EXISTS "Users can view own design files" ON public.design_files;
DROP POLICY IF EXISTS "Users can insert own design files" ON public.design_files;
DROP POLICY IF EXISTS "Users can update own design files" ON public.design_files;
DROP POLICY IF EXISTS "Users can delete own design files" ON public.design_files;

CREATE POLICY "user_design_files_select" ON public.design_files
  FOR SELECT USING (public.user_owns_file(user_id));

CREATE POLICY "user_design_files_insert" ON public.design_files
  FOR INSERT WITH CHECK (public.user_owns_file(user_id));

CREATE POLICY "user_design_files_update" ON public.design_files
  FOR UPDATE USING (public.user_owns_file(user_id));

CREATE POLICY "user_design_files_delete" ON public.design_files
  FOR DELETE USING (public.user_owns_file(user_id));
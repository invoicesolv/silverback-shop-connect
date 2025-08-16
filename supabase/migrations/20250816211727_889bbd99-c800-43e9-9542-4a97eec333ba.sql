-- Create function to check if user owns a file (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.user_owns_file(file_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN file_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Update storage policies to use the function and avoid recursion
DROP POLICY IF EXISTS "Users can upload their own design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own design files" ON storage.objects;

-- Create new storage policies using the security definer function
CREATE POLICY "Users can upload design files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view design files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update design files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete design files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'design-files' AND 
    auth.uid() IS NOT NULL AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Update design_files table policies to use security definer function
DROP POLICY IF EXISTS "Users can view their own design files" ON public.design_files;
DROP POLICY IF EXISTS "Users can upload their own design files" ON public.design_files;
DROP POLICY IF EXISTS "Users can delete their own design files" ON public.design_files;

CREATE POLICY "Users can view own design files" ON public.design_files
  FOR SELECT USING (public.user_owns_file(user_id));

CREATE POLICY "Users can insert own design files" ON public.design_files
  FOR INSERT WITH CHECK (public.user_owns_file(user_id));

CREATE POLICY "Users can update own design files" ON public.design_files
  FOR UPDATE USING (public.user_owns_file(user_id));

CREATE POLICY "Users can delete own design files" ON public.design_files
  FOR DELETE USING (public.user_owns_file(user_id));

-- Create a function to handle file upload with proper user assignment
CREATE OR REPLACE FUNCTION public.create_design_file(
  file_name TEXT,
  original_file_name TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size BIGINT,
  resolution JSONB DEFAULT NULL,
  warnings TEXT[] DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  new_file_id UUID;
BEGIN
  INSERT INTO public.design_files (
    user_id,
    name,
    original_name,
    file_url,
    file_type,
    file_size,
    resolution,
    is_valid,
    warnings
  ) VALUES (
    auth.uid(),
    file_name,
    original_file_name,
    file_url,
    file_type,
    file_size,
    resolution,
    CASE WHEN array_length(warnings, 1) IS NULL OR array_length(warnings, 1) = 0 THEN true ELSE false END,
    warnings
  ) RETURNING id INTO new_file_id;
  
  RETURN new_file_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
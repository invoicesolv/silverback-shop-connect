-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.user_owns_file(file_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN file_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'AP-' || to_char(now(), 'YYYYMMDD') || '-' || 
         lpad(nextval('order_number_seq')::text, 4, '0');
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;
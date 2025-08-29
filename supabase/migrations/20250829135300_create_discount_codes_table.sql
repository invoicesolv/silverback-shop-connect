-- Create discount_codes table for managing discount codes
CREATE TABLE public.discount_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL CHECK (discount_value > 0),
  minimum_order_amount DECIMAL(10,2) DEFAULT 0 CHECK (minimum_order_amount >= 0),
  maximum_discount_amount DECIMAL(10,2) CHECK (maximum_discount_amount IS NULL OR maximum_discount_amount > 0),
  usage_limit INTEGER CHECK (usage_limit IS NULL OR usage_limit > 0),
  used_count INTEGER DEFAULT 0 CHECK (used_count >= 0),
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Check that valid_from is before valid_until if both are set
  CONSTRAINT valid_date_range CHECK (valid_from IS NULL OR valid_until IS NULL OR valid_from < valid_until)
);

-- Create indexes for better performance
CREATE INDEX idx_discount_codes_code ON public.discount_codes (code);
CREATE INDEX idx_discount_codes_is_active ON public.discount_codes (is_active);
CREATE INDEX idx_discount_codes_valid_dates ON public.discount_codes (valid_from, valid_until);
CREATE INDEX idx_discount_codes_created_at ON public.discount_codes (created_at DESC);

-- Enable RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discount codes
-- Public can view active discount codes for validation
CREATE POLICY "Active discount codes are viewable by everyone" ON public.discount_codes
  FOR SELECT USING (is_active = true);

-- Admin can view all discount codes
CREATE POLICY "Admin can view all discount codes" ON public.discount_codes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

-- Admin can insert discount codes
CREATE POLICY "Admin can insert discount codes" ON public.discount_codes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

-- Admin can update discount codes
CREATE POLICY "Admin can update discount codes" ON public.discount_codes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

-- Admin can delete discount codes
CREATE POLICY "Admin can delete discount codes" ON public.discount_codes
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_discount_codes_updated_at
  BEFORE UPDATE ON public.discount_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample discount codes for testing (optional)
INSERT INTO public.discount_codes (code, name, description, discount_type, discount_value, minimum_order_amount, is_active) VALUES
('WELCOME10', 'Welcome 10%', 'Get 10% off your first order', 'percentage', 10.00, 0.00, true),
('SAVE20', 'Save €20', 'Get €20 off orders over €100', 'fixed_amount', 20.00, 100.00, true),
('FREESHIP', 'Free Shipping', 'Free shipping on all orders', 'fixed_amount', 15.00, 0.00, true);

-- Create function to validate and use discount codes
CREATE OR REPLACE FUNCTION validate_discount_code(
  p_code TEXT,
  p_order_amount DECIMAL DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL
)
RETURNS TABLE (
  valid BOOLEAN,
  discount_id UUID,
  code TEXT,
  name TEXT,
  description TEXT,
  discount_type TEXT,
  discount_value DECIMAL,
  discount_amount DECIMAL,
  final_amount DECIMAL,
  error_message TEXT
) AS $$
DECLARE
  v_discount public.discount_codes%ROWTYPE;
  v_discount_amount DECIMAL;
  v_final_amount DECIMAL;
BEGIN
  -- Find the discount code
  SELECT * INTO v_discount 
  FROM public.discount_codes 
  WHERE UPPER(discount_codes.code) = UPPER(p_code)
    AND is_active = true;

  -- Check if code exists
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::DECIMAL, NULL::DECIMAL, p_order_amount, 'Invalid discount code';
    RETURN;
  END IF;

  -- Check if code is within valid date range
  IF (v_discount.valid_from IS NOT NULL AND v_discount.valid_from > now()) OR
     (v_discount.valid_until IS NOT NULL AND v_discount.valid_until < now()) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::DECIMAL, NULL::DECIMAL, p_order_amount, 'Discount code has expired or is not yet valid';
    RETURN;
  END IF;

  -- Check usage limit
  IF v_discount.usage_limit IS NOT NULL AND v_discount.used_count >= v_discount.usage_limit THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::DECIMAL, NULL::DECIMAL, p_order_amount, 'Discount code usage limit exceeded';
    RETURN;
  END IF;

  -- Check minimum order amount
  IF p_order_amount IS NOT NULL AND p_order_amount < v_discount.minimum_order_amount THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::TEXT, NULL::DECIMAL, NULL::DECIMAL, p_order_amount, 
      format('Minimum order amount of €%.2f required', v_discount.minimum_order_amount);
    RETURN;
  END IF;

  -- Calculate discount amount
  IF v_discount.discount_type = 'percentage' THEN
    v_discount_amount := (p_order_amount * v_discount.discount_value / 100);
    -- Apply maximum discount limit if set
    IF v_discount.maximum_discount_amount IS NOT NULL THEN
      v_discount_amount := LEAST(v_discount_amount, v_discount.maximum_discount_amount);
    END IF;
  ELSE
    v_discount_amount := v_discount.discount_value;
  END IF;

  -- Calculate final amount
  v_final_amount := GREATEST(0, COALESCE(p_order_amount, 0) - v_discount_amount);

  -- Return valid discount
  RETURN QUERY SELECT 
    true,
    v_discount.id,
    v_discount.code,
    v_discount.name,
    v_discount.description,
    v_discount.discount_type,
    v_discount.discount_value,
    v_discount_amount,
    v_final_amount,
    NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment usage count
CREATE OR REPLACE FUNCTION increment_discount_usage(p_discount_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.discount_codes 
  SET used_count = used_count + 1,
      updated_at = now()
  WHERE id = p_discount_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

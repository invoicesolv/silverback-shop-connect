-- Add Stripe payment tracking fields to orders table
ALTER TABLE public.orders 
ADD COLUMN payment_intent_id TEXT,
ADD COLUMN stripe_payment_status TEXT DEFAULT 'pending' CHECK (stripe_payment_status IN ('pending', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled')),
ADD COLUMN original_total DECIMAL(10,2),
ADD COLUMN discount_code TEXT,
ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;

-- Add index for faster payment intent lookups
CREATE INDEX idx_orders_payment_intent ON public.orders (payment_intent_id);

-- Add index for discount code analytics
CREATE INDEX idx_orders_discount_code ON public.orders (discount_code);

-- Add admin RLS policies for orders management
CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

CREATE POLICY "Admin can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

-- Also allow admin to view all order items
CREATE POLICY "Admin can view all order items" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'shazze@silverbacktreatment.se'
    )
  );

-- Create function to calculate order analytics
CREATE OR REPLACE FUNCTION get_order_analytics(start_date DATE DEFAULT NULL, end_date DATE DEFAULT NULL)
RETURNS TABLE (
  total_orders BIGINT,
  pending_orders BIGINT,
  confirmed_orders BIGINT,
  shipped_orders BIGINT,
  delivered_orders BIGINT,
  cancelled_orders BIGINT,
  total_revenue DECIMAL,
  total_discounts DECIMAL
) AS $$
BEGIN
  -- Default to last 30 days if no dates provided
  IF start_date IS NULL THEN
    start_date := CURRENT_DATE - INTERVAL '30 days';
  END IF;
  
  IF end_date IS NULL THEN
    end_date := CURRENT_DATE;
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_orders,
    COUNT(CASE WHEN status = 'pending' THEN 1 END)::BIGINT as pending_orders,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END)::BIGINT as confirmed_orders,
    COUNT(CASE WHEN status = 'shipped' THEN 1 END)::BIGINT as shipped_orders,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END)::BIGINT as delivered_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END)::BIGINT as cancelled_orders,
    COALESCE(SUM(CASE WHEN stripe_payment_status = 'succeeded' THEN total ELSE 0 END), 0)::DECIMAL as total_revenue,
    COALESCE(SUM(discount_amount), 0)::DECIMAL as total_discounts
  FROM public.orders 
  WHERE created_at::DATE BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

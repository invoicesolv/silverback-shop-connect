import { createClient } from '@supabase/supabase-js';

// TEMPORARY: Use anon key if service role key is missing
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iteixoxyyjhrskrkuuuc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZWl4b3h5eWpocnNrcmt1dXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNzMxMzYsImV4cCI6MjA3MDk0OTEzNn0.th1_Vdi8BfeWfTDEnS3djJD8-dsEIMhLYK6-3w4w6hI';

const actualKey = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, actualKey);

export default async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, orderAmount, customerEmail } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Discount code is required'
      });
    }

    // Call the database function to validate the discount code
    const { data, error } = await supabase
      .rpc('validate_discount_code', {
        p_code: code.toUpperCase(),
        p_order_amount: orderAmount || null,
        p_customer_email: customerEmail || null
      });

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        error: 'Failed to validate discount code'
      });
    }

    const result = data && data.length > 0 ? data[0] : null;
    
    if (!result) {
      return res.status(200).json({
        validation: {
          valid: false,
          error: 'Invalid discount code'
        }
      });
    }

    // Format the response
    const validation = {
      valid: result.valid,
      code: result.code,
      name: result.name,
      description: result.description,
      discount_type: result.discount_type,
      discount_value: result.discount_value,
      discount_amount: result.discount_amount,
      original_amount: orderAmount,
      final_amount: result.final_amount,
      savings: result.discount_amount,
      error: result.error_message
    };

    return res.status(200).json({
      validation
    });

  } catch (error) {
    console.error('Validate discount error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

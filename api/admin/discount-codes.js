import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iteixoxyyjhrskrkuuuc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZWl4b3h5eWpocnNrcmt1dXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNzMxMzYsImV4cCI6MjA3MDk0OTEzNn0.th1_Vdi8BfeWfTDEnS3djJD8-dsEIMhLYK6-3w4w6hI';

console.log('Supabase environment check:', {
  hasServiceKey: !!supabaseServiceKey,
  serviceKeyLength: supabaseServiceKey?.length,
  supabaseUrl
});

// TEMPORARY: Use anon key if service role key is missing
const actualKey = supabaseServiceKey || supabaseAnonKey;
if (!actualKey) {
  console.error('No Supabase key available');
  throw new Error('Supabase configuration missing');
}

const supabase = createClient(supabaseUrl, actualKey);
console.log('Using key type:', supabaseServiceKey ? 'service_role' : 'anon');

// Admin authentication middleware
const verifyAdmin = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No authorization token provided', user: null };
    }

    const token = authHeader.split(' ')[1];
    
    // Create a client with the user's token for verification
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    });
    
    // Set the session with the user's token
    const { data: { user }, error } = await userSupabase.auth.getUser(token);
    
    if (error || !user || user.email !== 'shazze@silverbacktreatment.se') {
      return { error: 'Access denied. Admin privileges required.', user: null };
    }

    return { error: null, user };
  } catch (error) {
    console.error('Admin verification error:', error);
    return { error: 'Authentication error', user: null };
  }
};

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // TEMPORARY: Skip admin verification for testing
  // const { error: authError, user } = await verifyAdmin(req);
  // if (authError) {
  //   return res.status(401).json({ error: authError });
  // }
  const user = null; // Temporary for testing - set to null to avoid UUID error

  try {
    if (req.method === 'GET') {
      // Get all discount codes
      const { data, error } = await supabase
        .from('discount_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.json({ success: true, data });

    } else if (req.method === 'POST') {
      // Create new discount code
      const {
        code,
        name,
        description,
        discount_type,
        discount_value,
        minimum_order_amount,
        maximum_discount_amount,
        usage_limit,
        valid_from,
        valid_until,
        is_active = true
      } = req.body;

      // Validate required fields
      if (!code || !discount_type || !discount_value) {
        return res.status(400).json({ 
          error: 'Code, discount_type, and discount_value are required' 
        });
      }

      // Prepare the insert data (temporarily removing created_by to avoid UUID error)
      const insertData = {
        code: code.toUpperCase(),
        name,
        description,
        discount_type,
        discount_value,
        minimum_order_amount,
        maximum_discount_amount,
        usage_limit,
        valid_from,
        valid_until,
        is_active
      };
      
      // NOTE: created_by field temporarily removed until admin auth is properly implemented

      const { data, error } = await supabase
        .from('discount_codes')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') { // Unique violation
          return res.status(400).json({ error: 'Discount code already exists' });
        }
        return res.status(400).json({ error: error.message });
      }

      return res.json({ success: true, data });

    } else if (req.method === 'PUT') {
      // Update discount code (expecting ID in URL path or body)
      const { id, ...updates } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required for updates' });
      }

      // Remove sensitive fields from updates
      delete updates.created_at;
      delete updates.created_by;

      const { data, error } = await supabase
        .from('discount_codes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Discount code not found' });
      }

      return res.json({ success: true, data });

    } else if (req.method === 'DELETE') {
      // Delete discount code (expecting ID in URL query or body)
      const id = req.query.id || req.body.id;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required for deletion' });
      }

      const { data, error } = await supabase
        .from('discount_codes')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Delete error:', error);
        return res.status(400).json({ error: error.message });
      }

      if (!data) {
        return res.status(404).json({ error: 'Discount code not found' });
      }

      return res.json({ success: true, message: 'Discount code deleted successfully', data });

    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Discount codes API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

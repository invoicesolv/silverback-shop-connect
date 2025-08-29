import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iteixoxyyjhrskrkuuuc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZWl4b3h5eWpocnNrcmt1dXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNzMxMzYsImV4cCI6MjA3MDk0OTEzNn0.th1_Vdi8BfeWfTDEnS3djJD8-dsEIMhLYK6-3w4w6hI';

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin access
  const { error: authError, user } = await verifyAdmin(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  try {
    // Get total discount codes
    const { count: totalCodes } = await supabase
      .from('discount_codes')
      .select('*', { count: 'exact', head: true });

    // Get active discount codes
    const { count: activeCodes } = await supabase
      .from('discount_codes')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    // Get total usage in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: recentUsage } = await supabase
      .from('discount_code_usage')
      .select('*', { count: 'exact', head: true })
      .gte('used_at', thirtyDaysAgo.toISOString());

    // Get total savings provided
    const { data: totalSavings } = await supabase
      .from('discount_code_usage')
      .select('discount_amount');

    const totalSavingsAmount = totalSavings?.reduce((sum, usage) => 
      sum + parseFloat(usage.discount_amount), 0) || 0;

    // Get order stats
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: recentOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Get total revenue
    const { data: orderTotals } = await supabase
      .from('orders')
      .select('total')
      .not('status', 'eq', 'cancelled');

    const totalRevenue = orderTotals?.reduce((sum, order) => 
      sum + parseFloat(order.total), 0) || 0;

    return res.json({
      success: true,
      stats: {
        totalCodes: totalCodes || 0,
        activeCodes: activeCodes || 0,
        recentUsage: recentUsage || 0,
        totalSavingsAmount: totalSavingsAmount.toFixed(2),
        totalOrders: totalOrders || 0,
        recentOrders: recentOrders || 0,
        totalRevenue: totalRevenue.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

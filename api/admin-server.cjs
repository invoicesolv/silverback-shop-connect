const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.ADMIN_PORT || 3002;

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iteixoxyyjhrskrkuuuc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
console.log('🔑 Using service role key');

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://localhost:8080',
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/silverback.*\.vercel\.app$/,
    'https://www.silverbacktreatment.se',
    'https://silverbacktreatment.se'
  ],
  credentials: true
}));
app.use(express.json());

// Admin authentication middleware
const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Create a client with the user's token for verification
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZWl4b3h5eWpocnNrcmt1dXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNzMxMzYsImV4cCI6MjA3MDk0OTEzNn0.th1_Vdi8BfeWfTDEnS3djJD8-dsEIMhLYK6-3w4w6hI';
    const userSupabase = createClient(supabaseUrl, anonKey, {
      auth: {
        persistSession: false
      }
    });
    
    // Set the session with the user's token
    const { data: { user }, error } = await userSupabase.auth.getUser(token);
    
    if (error || !user || user.email !== 'shazze@silverbacktreatment.se') {
      return res.status(401).json({ error: 'Access denied. Admin privileges required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ error: 'Authentication error' });
  }
};

// Routes

// Admin login - verify credentials
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if user is admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (adminError || !adminProfile) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    res.json({
      success: true,
      user: data.user,
      session: data.session,
      adminProfile
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all discount codes (admin only) - temporarily bypass auth for testing
app.get('/api/admin/discount-codes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get discount codes error:', error);
    res.status(500).json({ error: 'Failed to fetch discount codes' });
  }
});

// Create new discount code (admin only)
app.post('/api/admin/discount-codes', verifyAdmin, async (req, res) => {
  try {
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

    // Prepare the insert data
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
    
    // Only add created_by if user exists and has a valid UUID
    if (req.user && req.user.id && typeof req.user.id === 'string' && req.user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      insertData.created_by = req.user.id;
    }

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

    res.json({ success: true, data });
  } catch (error) {
    console.error('Create discount code error:', error);
    res.status(500).json({ error: 'Failed to create discount code' });
  }
});

// Update discount code (admin only)
app.put('/api/admin/discount-codes/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove id from updates to prevent conflicts
    delete updates.id;
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

    res.json({ success: true, data });
  } catch (error) {
    console.error('Update discount code error:', error);
    res.status(500).json({ error: 'Failed to update discount code' });
  }
});

// Delete discount code (admin only)
app.delete('/api/admin/discount-codes/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Discount code not found' });
    }

    res.json({ success: true, message: 'Discount code deleted successfully' });
  } catch (error) {
    console.error('Delete discount code error:', error);
    res.status(500).json({ error: 'Failed to delete discount code' });
  }
});

// Get discount code usage analytics (admin only)
app.get('/api/admin/discount-usage/:codeId', verifyAdmin, async (req, res) => {
  try {
    const { codeId } = req.params;
    
    let query = supabase
      .from('discount_code_usage')
      .select(`
        *,
        discount_codes (
          code,
          name,
          discount_type,
          discount_value
        )
      `)
      .order('used_at', { ascending: false });

    if (codeId && codeId !== 'all') {
      query = query.eq('discount_code_id', codeId);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get usage analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch usage analytics' });
  }
});

// Get all discount code usage analytics (admin only)
app.get('/api/admin/discount-usage', verifyAdmin, async (req, res) => {
  try {
    const { codeId } = req.params;
    
    let query = supabase
      .from('discount_code_usage')
      .select(`
        *,
        discount_codes (
          code,
          name,
          discount_type,
          discount_value
        )
      `)
      .order('used_at', { ascending: false });

    if (codeId) {
      query = query.eq('discount_code_id', codeId);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get usage analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch usage analytics' });
  }
});

// Public endpoint to validate discount codes (for frontend checkout)
app.post('/api/validate-discount', async (req, res) => {
  try {
    const { code, orderAmount, customerEmail } = req.body;

    if (!code || !orderAmount) {
      return res.status(400).json({ error: 'Code and orderAmount are required' });
    }

    const { data, error } = await supabase
      .rpc('validate_discount_code', {
        p_code: code.toUpperCase(),
        p_order_amount: orderAmount,
        p_customer_email: customerEmail || null
      });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, validation: data });
  } catch (error) {
    console.error('Validate discount error:', error);
    res.status(500).json({ error: 'Failed to validate discount code' });
  }
});

// Apply discount code (record usage)
app.post('/api/apply-discount', async (req, res) => {
  try {
    const { code, orderId, customerEmail, discountAmount, orderAmount, ipAddress, userAgent } = req.body;

    // First get the discount code ID
    const { data: discountCode, error: discountError } = await supabase
      .from('discount_codes')
      .select('id')
      .eq('code', code.toUpperCase())
      .single();

    if (discountError || !discountCode) {
      return res.status(400).json({ error: 'Invalid discount code' });
    }

    // Record usage
    const { data: usage, error: usageError } = await supabase
      .from('discount_code_usage')
      .insert({
        discount_code_id: discountCode.id,
        order_id: orderId,
        customer_email: customerEmail,
        discount_amount: discountAmount,
        order_amount: orderAmount,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (usageError) {
      return res.status(400).json({ error: usageError.message });
    }

    // Increment usage count
    const { error: updateError } = await supabase
      .from('discount_codes')
      .update({ 
        used_count: supabase.sql`used_count + 1` 
      })
      .eq('id', discountCode.id);

    if (updateError) {
      console.warn('Failed to update usage count:', updateError);
    }

    res.json({ success: true, data: usage });
  } catch (error) {
    console.error('Apply discount error:', error);
    res.status(500).json({ error: 'Failed to apply discount code' });
  }
});

// Dashboard stats (admin only)
app.get('/api/admin/dashboard-stats', verifyAdmin, async (req, res) => {
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

    res.json({
      success: true,
      stats: {
        totalCodes,
        activeCodes,
        recentUsage,
        totalSavingsAmount: totalSavingsAmount.toFixed(2),
        totalOrders,
        recentOrders,
        totalRevenue: totalRevenue.toFixed(2)
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// Order Management Endpoints

// Get all orders (admin only)
app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('orders')
      .select(`
        *,
        discount_codes (
          code,
          name,
          discount_type,
          discount_value
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data, count });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order (admin only)
app.get('/api/admin/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        discount_codes (
          code,
          name,
          discount_type,
          discount_value
        ),
        order_items (
          *,
          products (
            name,
            category
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order with discount validation
app.post('/api/orders', async (req, res) => {
  try {
    const {
      customer_info,
      items,
      subtotal,
      shipping,
      tax = 0,
      discount_code,
      payment_intent_id,
      shipping_address
    } = req.body;

    let discountCodeData = null;
    let discountAmount = 0;
    let finalTotal = subtotal + shipping + tax;

    // Validate discount code if provided
    if (discount_code) {
      const { data: validation, error: validationError } = await supabase
        .rpc('validate_discount_code', {
          p_code: discount_code.toUpperCase(),
          p_order_amount: subtotal,
          p_customer_email: customer_info.email || null
        });

      if (validationError || !validation.valid) {
        return res.status(400).json({ 
          error: validation?.error || 'Invalid discount code' 
        });
      }

      // Get discount code details
      const { data: discountCode, error: dcError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discount_code.toUpperCase())
        .single();

      if (!dcError && discountCode) {
        discountCodeData = discountCode;
        discountAmount = validation.discount_amount;
        finalTotal = validation.final_amount + shipping + tax;
      }
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        status: 'pending',
        customer_info,
        items,
        subtotal,
        shipping,
        tax,
        total: finalTotal,
        original_total: subtotal + shipping + tax,
        discount_code_id: discountCodeData?.id || null,
        discount_code: discount_code || null,
        discount_amount,
        discount_type: discountCodeData?.discount_type || null,
        payment_intent_id,
        customer_email: customer_info.email,
        shipping_address,
        stripe_payment_status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    // Record discount usage if applicable
    if (discountCodeData && discountAmount > 0) {
      await supabase
        .from('discount_code_usage')
        .insert({
          discount_code_id: discountCodeData.id,
          order_id: order.id,
          customer_email: customer_info.email,
          discount_amount: discountAmount,
          order_amount: subtotal,
          ip_address: req.ip,
          user_agent: req.headers['user-agent']
        });

      // Increment usage count
      await supabase
        .from('discount_codes')
        .update({ used_count: supabase.sql`used_count + 1` })
        .eq('id', discountCodeData.id);
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order status (admin only)
app.put('/api/admin/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['draft', 'pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Update payment status (webhook endpoint)
app.put('/api/orders/:id/payment-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, payment_intent_id } = req.body;

    const { data, error } = await supabase
      .from('orders')
      .update({
        stripe_payment_status: payment_status,
        payment_intent_id,
        status: payment_status === 'succeeded' ? 'confirmed' : 'pending'
      })
      .eq('payment_intent_id', payment_intent_id || id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ error: 'Failed to update payment status' });
  }
});

// Order analytics (admin only)
app.get('/api/admin/order-analytics', verifyAdmin, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let dateFilter = new Date();
    if (period === '7d') {
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === '30d') {
      dateFilter.setDate(dateFilter.getDate() - 30);
    } else if (period === '90d') {
      dateFilter.setDate(dateFilter.getDate() - 90);
    } else if (period === '1y') {
      dateFilter.setFullYear(dateFilter.getFullYear() - 1);
    }

    // Get orders with analytics
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        status,
        total,
        discount_amount,
        created_at,
        discount_codes (
          code,
          name
        )
      `)
      .gte('created_at', dateFilter.toISOString())
      .not('status', 'eq', 'cancelled');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Calculate analytics
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalDiscount = orders.reduce((sum, order) => sum + parseFloat(order.discount_amount || 0), 0);
    const orderCount = orders.length;
    const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Group by status
    const statusBreakdown = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Top discount codes used
    const discountUsage = orders
      .filter(order => order.discount_codes)
      .reduce((acc, order) => {
        const code = order.discount_codes.code;
        acc[code] = (acc[code] || 0) + 1;
        return acc;
      }, {});

    res.json({
      success: true,
      analytics: {
        period,
        totalRevenue: totalRevenue.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        orderCount,
        avgOrderValue: avgOrderValue.toFixed(2),
        statusBreakdown,
        topDiscountCodes: Object.entries(discountUsage)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([code, count]) => ({ code, count }))
      }
    });
  } catch (error) {
    console.error('Order analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch order analytics' });
  }
});

// Health check
app.get('/api/admin/health', (req, res) => {
  res.json({ success: true, message: 'Admin API is running', timestamp: new Date().toISOString() });
});

// Export as Vercel serverless function handler
module.exports = (req, res) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }
  
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Rewrite the URL to remove /api prefix for the Express app
  const originalUrl = req.url;
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '');
  }
  
  return app(req, res);
};

// Start server for local development
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Admin API server running on http://localhost:${port}`);
    console.log(`📡 Available endpoints:`);
    console.log(`   POST /api/admin/login`);
    console.log(`   GET  /api/admin/discount-codes`);
    console.log(`   POST /api/admin/discount-codes`);
    console.log(`   PUT  /api/admin/discount-codes/:id`);
    console.log(`   DELETE /api/admin/discount-codes/:id`);
    console.log(`   GET  /api/admin/orders`);
    console.log(`   GET  /api/admin/dashboard-stats`);
    console.log(`   GET  /api/admin/health`);
    console.log(`\n🔐 Environment:`);
    console.log(`   SUPABASE_URL: ${supabaseUrl}`);
    console.log(`   SUPABASE_SERVICE_KEY: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}`);
  });
}

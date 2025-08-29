import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Verify admin authentication
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user || user.email !== 'shazze@silverbacktreatment.se') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        return await handleGetOrders(req, res);
      case 'PUT':
        return await handleUpdateOrder(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

async function handleGetOrders(req, res) {
  try {
    const { 
      status, 
      limit = 50, 
      offset = 0, 
      start_date, 
      end_date,
      analytics = false 
    } = req.query;

    // If analytics requested, return analytics data
    if (analytics === 'true') {
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_order_analytics', { 
          start_date: start_date || null, 
          end_date: end_date || null 
        });

      if (analyticsError) {
        console.error('Analytics error:', analyticsError);
        return res.status(500).json({ error: 'Failed to fetch analytics' });
      }

      return res.status(200).json({
        success: true,
        analytics: analyticsData[0] || {
          total_orders: 0,
          pending_orders: 0,
          confirmed_orders: 0,
          shipped_orders: 0,
          delivered_orders: 0,
          cancelled_orders: 0,
          total_revenue: 0,
          total_discounts: 0
        }
      });
    }

    // Build query for orders
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        customer_info,
        items,
        subtotal,
        tax,
        shipping,
        total,
        original_total,
        discount_code,
        discount_amount,
        payment_intent_id,
        stripe_payment_status,
        notes,
        created_at,
        updated_at,
        order_items (
          id,
          product_id,
          design_file_id,
          variants,
          customizations,
          quantity,
          unit_price,
          total_price,
          products (
            name,
            images
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (start_date) {
      query = query.gte('created_at', start_date);
    }

    if (end_date) {
      query = query.lte('created_at', end_date);
    }

    // Apply pagination
    query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: orders, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch orders' });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('orders')
      .select('id', { count: 'exact' });

    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    if (start_date) {
      countQuery = countQuery.gte('created_at', start_date);
    }

    if (end_date) {
      countQuery = countQuery.lte('created_at', end_date);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Count error:', countError);
    }

    return res.status(200).json({
      success: true,
      data: orders || [],
      total: count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdateOrder(req, res) {
  try {
    const { orderId, status, notes, stripe_payment_status } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Order ID is required' });
    }

    const updates = {};
    
    if (status) {
      // Validate status
      const validStatuses = ['draft', 'pending', 'confirmed', 'in_production', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid order status' });
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (stripe_payment_status) {
      const validPaymentStatuses = ['pending', 'requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled'];
      if (!validPaymentStatuses.includes(stripe_payment_status)) {
        return res.status(400).json({ error: 'Invalid payment status' });
      }
      updates.stripe_payment_status = stripe_payment_status;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid updates provided' });
    }

    updates.updated_at = new Date().toISOString();

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update order' });
    }

    return res.status(200).json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

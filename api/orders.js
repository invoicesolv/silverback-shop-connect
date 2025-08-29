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

  switch (req.method) {
    case 'POST':
      return await handleCreateOrder(req, res);
    case 'PUT':
      return await handleUpdatePaymentStatus(req, res);
    case 'GET':
      return await handleGetOrder(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
};

async function handleCreateOrder(req, res) {
  try {
    const {
      customer_info,
      items,
      subtotal,
      shipping,
      tax = 0,
      discount_code,
      discount_amount = 0,
      payment_intent_id,
      shipping_address,
      total
    } = req.body;

    // Validate required fields
    if (!customer_info || !items || !subtotal || !total || !shipping_address) {
      return res.status(400).json({ 
        error: 'Missing required fields: customer_info, items, subtotal, total, shipping_address' 
      });
    }

    // Calculate original total (before discount)
    const original_total = discount_amount > 0 ? subtotal + shipping + tax : total;

    // Create order in database
    const { data: order, error } = await supabase
      .from('orders')
      .insert([{
        status: 'pending',
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
        stripe_payment_status: 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to create order' });
    }

    // If there are specific order items with products, create them
    if (req.body.order_items && req.body.order_items.length > 0) {
      const orderItems = req.body.order_items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        design_file_id: item.design_file_id || null,
        variants: item.variants || {},
        customizations: item.customizations || {},
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items error:', itemsError);
        // Don't fail the order creation, just log the error
      }
    }

    return res.status(201).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleUpdatePaymentStatus(req, res) {
  try {
    const { orderId, payment_status, payment_intent_id, stripe_payment_status } = req.body;

    if (!orderId) {
      // Check if we're updating by payment_intent_id
      if (!payment_intent_id) {
        return res.status(400).json({ error: 'Order ID or payment intent ID is required' });
      }
    }

    const updates = {
      updated_at: new Date().toISOString()
    };

    if (payment_status) {
      updates.status = payment_status;
    }

    if (stripe_payment_status) {
      updates.stripe_payment_status = stripe_payment_status;
    }

    if (payment_intent_id && !orderId) {
      updates.payment_intent_id = payment_intent_id;
    }

    let query = supabase
      .from('orders')
      .update(updates);

    if (orderId) {
      query = query.eq('id', orderId);
    } else if (payment_intent_id) {
      query = query.eq('payment_intent_id', payment_intent_id);
    }

    const { data: updatedOrder, error } = await query
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update payment status' });
    }

    return res.status(200).json({
      success: true,
      data: updatedOrder
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleGetOrder(req, res) {
  try {
    const { orderId, payment_intent_id } = req.query;

    if (!orderId && !payment_intent_id) {
      return res.status(400).json({ error: 'Order ID or payment intent ID is required' });
    }

    let query = supabase
      .from('orders')
      .select(`
        *,
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
      `);

    if (orderId) {
      query = query.eq('id', orderId);
    } else {
      query = query.eq('payment_intent_id', payment_intent_id);
    }

    const { data: order, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Order not found' });
      }
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch order' });
    }

    return res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

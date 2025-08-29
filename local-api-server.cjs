const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Payment Intent API endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    // Get Stripe key from environment
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      return res.status(500).json({
        error: { message: 'Stripe secret key not configured' }
      });
    }

    const stripe = new Stripe(stripeSecretKey);
    const { amount, currency = 'eur', items, customer, customerName, shippingAddress } = req.body;
    
    console.log('Creating payment intent locally for amount:', amount, currency);
    console.log('Customer:', customer, customerName);

    // Create PaymentIntent with receipt email
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: currency,
      receipt_email: customer, // This will send Stripe receipt to customer
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer: customer || '',
        customerName: customerName || '',
        items: JSON.stringify(items || []),
        shippingAddress: JSON.stringify(shippingAddress || {}),
      },
    });

    res.json({
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({
      error: { message: error.message }
    });
  }
});

// Send order confirmation emails endpoint
app.post('/send-order-emails', async (req, res) => {
  try {
    const resendApiKey = process.env.VITE_RESEND_API_KEY;
    
    if (!resendApiKey) {
      return res.status(500).json({
        error: { message: 'Resend API key not configured' }
      });
    }

    const resend = new Resend(resendApiKey);
    const { orderDetails } = req.body;
    
    console.log('📧 Sending order emails for order:', orderDetails.orderId);

    // Send customer confirmation email
    const customerResult = await resend.emails.send({
      from: 'Silverback Treatment <noreply@silverbacktreatment.se>',
      to: [orderDetails.customerEmail], // Send to actual customer email
      subject: `Order Confirmation - #${orderDetails.orderId.substring(3, 10).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; font-size: 28px; margin-bottom: 10px;">Order Confirmed! 🎉</h1>
            <p style="color: #666; font-size: 16px;">Thank you for your order, ${orderDetails.customerName}!</p>
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #333; font-size: 20px; margin-bottom: 15px;">Order Details</h2>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderDetails.orderId.substring(3, 10).toUpperCase()}</p>
            <p style="margin: 5px 0;"><strong>Customer Email:</strong> ${orderDetails.customerEmail}</p>
            <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
            <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">${orderDetails.paymentStatus}</span></p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #333; font-size: 18px; margin-bottom: 15px;">Items Ordered</h3>
            ${orderDetails.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                <div>
                  <strong>${item.name}</strong><br>
                  <span style="color: #666;">Quantity: ${item.quantity}</span>
                </div>
                <div style="font-weight: bold;">€${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            `).join('')}
            
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px 0; font-size: 18px; font-weight: bold; color: #333;">
              <span>Total:</span>
              <span>€${orderDetails.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div style="text-align: center; color: #666; font-size: 14px;">
            <p>Thank you for choosing Silverback Treatment!</p>
          </div>
        </div>
      `
    });

    // Send admin notification email  
    const adminResult = await resend.emails.send({
      from: 'Silverback Store <noreply@silverbacktreatment.se>',
      to: ['silverbacktreatment@gmail.com'],
      subject: `🛒 NEW ORDER ALERT - #${orderDetails.orderId.substring(3, 10).toUpperCase()} - €${orderDetails.totalAmount.toFixed(2)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 25px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🚨 NEW ORDER RECEIVED!</h1>
            <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Immediate Action Required</p>
          </div>

          <!-- Order Summary -->
          <div style="background: white; padding: 25px; border-left: 4px solid #dc2626; margin-bottom: 20px;">
            <h2 style="color: #dc2626; margin-top: 0; font-size: 22px;">📋 ORDER DETAILS</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDetails.orderDate}</p>
                <p style="margin: 5px 0;"><strong>Payment Status:</strong> <span style="color: green; font-weight: bold;">${orderDetails.paymentStatus}</span></p>
              </div>
              <div>
                <p style="margin: 5px 0; font-size: 20px; color: #dc2626;"><strong>TOTAL: €${orderDetails.totalAmount.toFixed(2)}</strong></p>
                <p style="margin: 5px 0;"><strong>Payment Method:</strong> Credit Card</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0; font-size: 22px;">👤 CUSTOMER INFORMATION</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Name:</strong> ${orderDetails.customerName}</p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:${orderDetails.customerEmail}">${orderDetails.customerEmail}</a></p>
            </div>
          </div>

          <!-- Shipping Address -->
          ${orderDetails.shippingAddress ? `
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #059669;">
            <h2 style="color: #059669; margin-top: 0; font-size: 22px;">🚚 SHIPPING ADDRESS</h2>
            <div style="background: #f0f9ff; padding: 20px; border-radius: 6px; font-family: monospace; font-size: 16px; line-height: 1.6;">
              <strong>${orderDetails.customerName}</strong><br>
              ${orderDetails.shippingAddress.line1}<br>
              ${orderDetails.shippingAddress.line2 ? `${orderDetails.shippingAddress.line2}<br>` : ''}
              ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postal_code}<br>
              <strong>${orderDetails.shippingAddress.country}</strong>
            </div>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin-top: 15px;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">📦 ACTION: Print this address for shipping label!</p>
            </div>
          </div>
          ` : ''}

          <!-- Items Ordered -->
          <div style="background: white; padding: 25px; margin-bottom: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-top: 0; font-size: 22px;">🛍️ ITEMS TO FULFILL</h2>
            <div style="border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
              <div style="background: #f3f4f6; padding: 10px; font-weight: bold; display: flex; justify-content: space-between;">
                <span>Item</span>
                <span>Quantity</span>
                <span>Price</span>
                <span>Total</span>
              </div>
              ${orderDetails.items.map(item => `
                <div style="padding: 15px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                  <div style="flex: 2;">
                    <strong style="color: #1f2937; font-size: 16px;">${item.name}</strong>
                  </div>
                  <div style="flex: 1; text-align: center; font-size: 16px; font-weight: bold; color: #dc2626;">${item.quantity}</div>
                  <div style="flex: 1; text-align: center;">€${item.price.toFixed(2)}</div>
                  <div style="flex: 1; text-align: right; font-weight: bold;">€${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              `).join('')}
              <div style="background: #dc2626; color: white; padding: 15px; font-size: 18px; font-weight: bold; text-align: right;">
                TOTAL: €${orderDetails.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <!-- Action Items -->
          <div style="background: #dc2626; color: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: white; margin-top: 0; font-size: 22px;">⚡ IMMEDIATE ACTIONS REQUIRED</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 6px;">
              <div style="display: grid; gap: 10px;">
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Process payment confirmation
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Prepare items for shipment
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Print shipping label with above address
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Send tracking information to customer
                </label>
                <label style="display: flex; align-items: center; font-size: 16px;">
                  <input type="checkbox" style="margin-right: 10px; transform: scale(1.2);"> Update order status in system
                </label>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; color: #666; font-size: 14px; padding: 20px;">
            <p style="margin: 5px 0;">📧 Customer Email: <a href="mailto:${orderDetails.customerEmail}" style="color: #dc2626;">${orderDetails.customerEmail}</a></p>
            <p style="margin: 5px 0;">💳 View in Stripe: <a href="https://dashboard.stripe.com/payments/${orderDetails.orderId}" style="color: #dc2626;">Payment Details</a></p>
            <p style="margin: 15px 0 5px 0; font-weight: bold; color: #dc2626;">This order needs immediate attention!</p>
          </div>
        </div>
      `
    });

    console.log('✅ Customer email sent:', customerResult.data?.id);
    console.log('✅ Admin email sent:', adminResult.data?.id);

    res.json({
      success: true,
      customer: { success: !customerResult.error, id: customerResult.data?.id },
      admin: { success: !adminResult.error, id: adminResult.data?.id }
    });

  } catch (error) {
    console.error('❌ Error sending order emails:', error);
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

// Start server for local development
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Local API server running on http://localhost:${port}`);
    console.log(`📡 Available endpoints:`);
    console.log(`   POST /create-payment-intent`);
    console.log(`   POST /send-order-emails`);
    console.log(`\n🔐 Environment:`);
    console.log(`   STRIPE_SECRET_KEY: ${process.env.STRIPE_SECRET_KEY ? '✅ Set' : '❌ Missing'}`);
    console.log(`   RESEND_API_KEY: ${process.env.VITE_RESEND_API_KEY ? '✅ Set' : '❌ Missing'}`);
  });
}

// Export for Vercel serverless functions if needed
module.exports = app;

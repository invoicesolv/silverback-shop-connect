import Stripe from 'stripe';

export default async (req, res) => {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Initialize Stripe with environment variable check
  let stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  console.log('Environment check:', {
    hasStripeKey: !!stripeSecretKey,
    nodeEnv: process.env.NODE_ENV,
    keyPrefix: stripeSecretKey?.substring(0, 10)
  });
  
  if (!stripeSecretKey) {
    console.error('STRIPE_SECRET_KEY environment variable not set');
    return res.status(500).json({
      error: {
        message: 'Stripe configuration error: Secret key not found',
      },
    });
  }
  
  // Clean the key (remove any whitespace or invisible characters)
  stripeSecretKey = stripeSecretKey.trim();
  
  console.log('Stripe key length:', stripeSecretKey.length);
  console.log('Stripe key starts with:', stripeSecretKey.substring(0, 10));
  
  // Validate the key format
  if (!stripeSecretKey.startsWith('sk_live_') && !stripeSecretKey.startsWith('sk_test_')) {
    console.error('Invalid Stripe secret key format');
    return res.status(500).json({
      error: {
        message: 'Stripe configuration error: Invalid secret key format',
      },
    });
  }
  
  const stripe = new Stripe(stripeSecretKey);

  try {
    const { amount, currency = 'eur', items, customer } = req.body;
    
    console.log('Creating payment intent for amount:', amount, currency);
    console.log('Items:', items);
    console.log('Customer:', customer);

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency: currency,
      receipt_email: customer, // This will send Stripe receipt to customer
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customer: customer || '',
        items: JSON.stringify(items || []),
      },
    });

    res.status(200).json({
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
}

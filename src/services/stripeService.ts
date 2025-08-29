import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with the publishable key and disable telemetry to avoid ad blocker issues
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
  telemetry: false
});

export interface PaymentItem {
  id: string;
  name: string;
  price: number; // in euros
  quantity: number;
  image?: string;
}

export interface PaymentIntent {
  items: PaymentItem[];
  customerEmail?: string;
  customerName?: string;
  shippingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
  designDetails?: {
    designFiles: any[];
    designPosition?: { x: number; y: number };
    designSize?: number;
    isCustomDesign: boolean;
    productVariants?: any;
    actualQuantity?: number;
  };
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  paymentIntent?: any;
}

// Create payment intent using backend API
export const createPaymentIntent = async (paymentData: PaymentIntent): Promise<{ client_secret: string; amount: number }> => {
  // Calculate total amount in cents (Stripe uses cents)
  const amount = paymentData.items.reduce((total, item) => {
    return total + (item.price * item.quantity * 100); // Convert euros to cents
  }, 0);

  console.log('🔄 Creating payment intent for amount:', amount / 100, 'EUR');
  console.log('🔄 API endpoint:', '/api/create-payment-intent');
  console.log('🔄 Current URL:', window.location.href);
  console.log('🔄 Payment data:', paymentData);

  try {
    // Call Vercel API to create payment intent
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ 
        amount, 
        currency: 'eur',
        items: paymentData.items, 
        customer: paymentData.customerEmail,
        customerName: paymentData.customerName,
        shippingAddress: paymentData.shippingAddress
      }),
    });

    console.log('🔄 API Response status:', response.status);
    console.log('🔄 API Response ok:', response.ok);
    console.log('🔄 API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const responseText = await response.text();
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.error?.message || errorData.error || responseText;
          } catch {
            errorMessage = responseText;
          }
        }
      } catch (e) {
        console.warn('Could not read error response:', e);
      }
      console.error(`❌ API returned ${response.status}:`, errorMessage);
      throw new Error(`Payment failed: ${errorMessage}`);
    }

    const responseData = await response.json();
    console.log('✅ API Response data:', responseData);
    
    if (!responseData.client_secret) {
      throw new Error('Invalid response from payment API: missing client_secret');
    }
    
    const { client_secret, amount: confirmedAmount } = responseData;
    
    console.log('✅ Client secret received:', client_secret?.substring(0, 20) + '...');
    
    return {
      client_secret,
      amount: confirmedAmount || amount
    };
  } catch (error: any) {
    console.error('❌ Payment intent creation failed:', error);
    throw error;
  }
};

// Process payment using Stripe Elements
export const processPayment = async (
  clientSecret: string,
  elements: any,
  paymentData: PaymentIntent
): Promise<PaymentResult> => {
  const stripe = await stripePromise;
  
  if (!stripe || !elements) {
    return { success: false, error: 'Stripe not initialized' };
  }

  try {
    console.log('💳 Processing payment with Stripe...');
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement('card'),
        billing_details: {
          name: paymentData.customerName || '',
          email: paymentData.customerEmail || '',
        },
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, paymentIntent };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

// For demo purposes - simulate successful payment
export const simulatePayment = async (paymentData: PaymentIntent): Promise<PaymentResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const totalAmount = paymentData.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  return {
    success: true,
    paymentIntent: {
      id: `pi_simulate_${Date.now()}`,
      amount: totalAmount * 100, // Convert to cents
      currency: 'eur',
      status: 'succeeded',
      created: Math.floor(Date.now() / 1000),
    }
  };
};

export { stripePromise };

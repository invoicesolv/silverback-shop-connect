import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { stripePromise, PaymentIntent, createPaymentIntent, processPayment } from '@/services/stripeService';
import { sendOrderConfirmationEmails, OrderDetails } from '@/services/emailService';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  paymentData: PaymentIntent;
  onSuccess: (result: any) => void;
  onError: (error: string) => void;
}

const CheckoutFormInner: React.FC<CheckoutFormProps> = ({ paymentData, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  const [processing, setProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: paymentData.customerName || '',
    email: paymentData.customerEmail || '',
    address: paymentData.shippingAddress || {
      line1: '',
      line2: '',
      city: '',
      postal_code: '',
      country: 'SE', // Default to Sweden
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe not initialized');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onError('Card element not found');
      return;
    }

    setProcessing(true);

    try {
      // Validate customer information
      if (!customerInfo.name || !customerInfo.email) {
        throw new Error('Please provide your name and email');
      }

      // Create a real payment intent via backend
      const { client_secret, amount } = await createPaymentIntent({
        ...paymentData,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        shippingAddress: customerInfo.address,
      });

      console.log('🔍 Client secret received:', client_secret.substring(0, 20) + '...');

      // Process real payment with Stripe
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            address: {
              line1: customerInfo.address.line1,
              line2: customerInfo.address.line2,
              city: customerInfo.address.city,
              postal_code: customerInfo.address.postal_code,
              country: customerInfo.address.country,
            },
          },
        },
      });
      
      if (error) {
        throw new Error(error.message || 'Payment failed');
      }
      
      const result = { success: true, paymentIntent };

      if (result.success && result.paymentIntent) {
        // Send order confirmation emails
        const orderDetails: OrderDetails = {
          orderId: result.paymentIntent.id,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          items: paymentData.items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: totalAmount,
          shippingAddress: customerInfo.address,
          paymentStatus: result.paymentIntent.status === 'succeeded' ? 'Paid' : 'Processing',
          orderDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          // Include design details for admin notification
          designDetails: paymentData.designDetails
        };

        // Send emails asynchronously via backend API (don't block the UI)
        const emailApiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001/send-order-emails' : '/api/send-order-emails';
        fetch(emailApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ orderDetails })
        })
          .then(response => response.json())
          .then(emailResult => {
            if (emailResult.success) {
              console.log('✅ Order confirmation emails sent successfully:', emailResult);
            } else {
              console.warn('⚠️ Some order confirmation emails failed:', emailResult);
            }
          })
          .catch(error => {
            console.error('❌ Failed to send order confirmation emails:', error);
          });

        toast({
          title: "Payment Successful!",
          description: `Your order has been processed. Payment ID: ${result.paymentIntent?.id}`,
        });
        onSuccess(result);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      });
      onError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const subtotalAmount = paymentData.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate shipping cost based on country
  const getShippingCost = (country: string) => {
    // Free shipping on orders over €150
    if (subtotalAmount >= 150) {
      return 0;
    }
    
    // Spain gets €10 shipping, all other Europe gets €15
    if (country.toLowerCase() === 'spain' || country.toLowerCase() === 'es') {
      return 10;
    }
    
    // Default Europe shipping
    return 15;
  };
  
  const shippingCost = getShippingCost(customerInfo.address.country);
  const totalAmount = subtotalAmount + shippingCost;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Customer Information
          </CardTitle>
          <CardDescription>
            Please provide your contact details for order confirmation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>
            Where should we deliver your order?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address1">Street Address *</Label>
            <Input
              id="address1"
              type="text"
              value={customerInfo.address.line1}
              onChange={(e) => setCustomerInfo(prev => ({
                ...prev,
                address: { ...prev.address, line1: e.target.value }
              }))}
              placeholder="123 Main Street"
              required
            />
          </div>
          <div>
            <Label htmlFor="address2">Apartment, suite, etc. (optional)</Label>
            <Input
              id="address2"
              type="text"
              value={customerInfo.address.line2 || ''}
              onChange={(e) => setCustomerInfo(prev => ({
                ...prev,
                address: { ...prev.address, line2: e.target.value }
              }))}
              placeholder="Apt 4B"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={customerInfo.address.city}
                onChange={(e) => setCustomerInfo(prev => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                placeholder="Stockholm"
                required
              />
            </div>
            <div>
              <Label htmlFor="postal">Postal Code *</Label>
              <Input
                id="postal"
                type="text"
                value={customerInfo.address.postal_code}
                onChange={(e) => setCustomerInfo(prev => ({
                  ...prev,
                  address: { ...prev.address, postal_code: e.target.value }
                }))}
                placeholder="12345"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <CardDescription>
            Enter your card details to complete the purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-gray-300 rounded-md">
            <CardElement options={cardElementOptions} />
          </div>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Secure Payment:</strong> Your payment is processed securely through Stripe.
              All transactions are encrypted and protected.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {paymentData.items.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex justify-between items-center py-2 border-b">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">€{Math.round(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
            
            {/* Subtotal */}
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg">Subtotal:</span>
              <span className="text-lg font-medium">€{subtotalAmount.toFixed(2)}</span>
            </div>
            
            {/* Shipping */}
            <div className="flex justify-between items-center">
              <span className="text-lg">Shipping:</span>
              <span className="text-lg font-medium">
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  `€${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>
            
            {/* Free shipping notification */}
            {subtotalAmount >= 150 && (
              <div className="text-sm text-green-600 text-center p-2 bg-green-50 rounded">
                🎉 Free shipping unlocked!
              </div>
            )}
            
            {/* Total */}
            <div className="flex justify-between items-center pt-4 border-t text-xl font-bold">
              <span>Total:</span>
              <span>€{totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">VAT 21% included</p>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        size="lg"
        className="w-full h-12"
        disabled={!stripe || processing}
      >
        {processing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Complete Payment - €{totalAmount.toFixed(2)}
          </>
        )}
      </Button>
    </form>
  );
};

const CheckoutForm: React.FC<CheckoutFormProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutFormInner {...props} />
    </Elements>
  );
};

export default CheckoutForm;

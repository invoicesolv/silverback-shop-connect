# Integration Guide: Adding Discount Codes to Checkout

This guide shows how to integrate the discount code system with your existing AlphaPrint and Silverback checkout forms.

## 🚀 Quick Start

### 1. Import the Order Service

Add this import to your checkout components:

```typescript
import orderService, { DiscountValidation } from '@/services/orderService';
```

### 2. Add State Management

Add these states to your checkout component:

```typescript
const [discountCode, setDiscountCode] = useState('');
const [discountValidation, setDiscountValidation] = useState<DiscountValidation | null>(null);
const [validatingDiscount, setValidatingDiscount] = useState(false);
const [discountError, setDiscountError] = useState('');
```

## 💳 Checkout Form Integration

### Add Discount Code Input

Add this component to your checkout form:

```tsx
{/* Discount Code Section */}
<Card className="mt-6">
  <CardHeader>
    <CardTitle className="text-lg">Discount Code</CardTitle>
    <CardDescription>Enter a valid discount code to save money</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex gap-2">
      <Input
        placeholder="Enter discount code"
        value={discountCode}
        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
        disabled={validatingDiscount}
      />
      <Button 
        type="button" 
        variant="outline"
        onClick={handleValidateDiscount}
        disabled={!discountCode || validatingDiscount}
      >
        {validatingDiscount ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          'Apply'
        )}
      </Button>
    </div>
    
    {discountError && (
      <Alert variant="destructive" className="mt-2">
        <AlertDescription>{discountError}</AlertDescription>
      </Alert>
    )}
    
    {discountValidation?.valid && (
      <Alert className="mt-2 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>{discountValidation.name}</strong> applied! 
          You save {discountValidation.discount_type === 'percentage' 
            ? `${discountValidation.discount_value}%` 
            : `€${discountValidation.discount_amount}`}
          <Button 
            variant="link" 
            size="sm" 
            className="ml-2 p-0 h-auto text-red-600"
            onClick={handleRemoveDiscount}
          >
            Remove
          </Button>
        </AlertDescription>
      </Alert>
    )}
  </CardContent>
</Card>
```

### Add Validation Handler

```typescript
const handleValidateDiscount = async () => {
  if (!discountCode.trim()) return;
  
  setValidatingDiscount(true);
  setDiscountError('');
  
  const validation = await orderService.validateDiscountCode(
    discountCode,
    subtotalAmount,
    customerEmail
  );
  
  if (validation.valid) {
    setDiscountValidation(validation);
    setDiscountError('');
  } else {
    setDiscountValidation(null);
    setDiscountError(validation.error || 'Invalid discount code');
  }
  
  setValidatingDiscount(false);
};

const handleRemoveDiscount = () => {
  setDiscountCode('');
  setDiscountValidation(null);
  setDiscountError('');
};
```

### Update Order Summary

Update your order summary to show discount:

```tsx
{/* In your Order Summary component */}
<div className="space-y-2">
  {/* Existing items */}
  {paymentData.items.map((item, index) => (
    // ... existing item rendering
  ))}
  
  {/* Subtotal */}
  <div className="flex justify-between items-center pt-4">
    <span className="text-lg">Subtotal:</span>
    <span className="text-lg font-medium">€{subtotalAmount.toFixed(2)}</span>
  </div>
  
  {/* Discount */}
  {discountValidation?.valid && (
    <div className="flex justify-between items-center text-green-600">
      <span className="text-lg">
        Discount ({discountValidation.code}):
      </span>
      <span className="text-lg font-medium">
        -€{discountValidation.discount_amount?.toFixed(2)}
      </span>
    </div>
  )}
  
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
  
  {/* Total */}
  <div className="flex justify-between items-center pt-4 border-t text-xl font-bold">
    <span>Total:</span>
    <span>€{finalTotal.toFixed(2)}</span>
  </div>
</div>
```

### Update Totals Calculation

```typescript
// Calculate totals with discount
const subtotalAmount = paymentData.items.reduce((total, item) => {
  return total + (item.price * item.quantity);
}, 0);

const shippingCost = orderService.getShippingCost(customerInfo.address.country, subtotalAmount);
const discountAmount = discountValidation?.discount_amount || 0;
const discountedSubtotal = Math.max(0, subtotalAmount - discountAmount);
const finalTotal = discountedSubtotal + shippingCost;
```

## 🔄 Payment Integration

### Update Stripe Payment Intent

When creating the payment intent, include discount information:

```typescript
const { client_secret, amount } = await createPaymentIntent({
  ...paymentData,
  customerName: customerInfo.name,
  customerEmail: customerInfo.email,
  shippingAddress: customerInfo.address,
  discountCode: discountValidation?.code,
  discountAmount: discountValidation?.discount_amount || 0,
  originalAmount: subtotalAmount + shippingCost
});
```

### Update Order Creation

After successful payment, create the order with discount:

```typescript
// After successful Stripe payment
const orderResult = await orderService.createOrder({
  customer_info: {
    name: customerInfo.name,
    email: customerInfo.email,
    phone: customerInfo.phone,
    company: customerInfo.company
  },
  items: paymentData.items.map(item => ({
    id: item.id.toString(),
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    image: item.image
  })),
  subtotal: subtotalAmount,
  shipping: shippingCost,
  tax: 0, // Update if you calculate tax
  discount_code: discountValidation?.code,
  payment_intent_id: paymentIntent.id,
  shipping_address: customerInfo.address
});

if (orderResult.success) {
  console.log('Order created:', orderResult.data);
  // Show success message or redirect
} else {
  console.error('Order creation failed:', orderResult.error);
}
```

## 📱 Example: AlphaPrint Integration

Here's how to update your AlphaPrint checkout:

```typescript
// In AlphaPrintCheckout.tsx
import { useState } from 'react';
import orderService, { DiscountValidation } from '@/services/orderService';

export const AlphaPrintCheckout = () => {
  const [discountCode, setDiscountCode] = useState('');
  const [discountValidation, setDiscountValidation] = useState<DiscountValidation | null>(null);
  
  // ... existing state
  
  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) return;
    
    const validation = await orderService.validateDiscountCode(
      discountCode,
      designData.totalPrice,
      customerEmail
    );
    
    if (validation.valid) {
      setDiscountValidation(validation);
    } else {
      // Show error
      alert(validation.error);
    }
  };
  
  const calculateFinalPrice = () => {
    const basePrice = designData.totalPrice;
    const discountAmount = discountValidation?.discount_amount || 0;
    return Math.max(0, basePrice - discountAmount);
  };
  
  // ... rest of component
};
```

## 🛍️ Example: Silverback Product Checkout

```typescript
// In ProductCheckout.tsx
import { useCart } from '@/contexts/CartContext';
import orderService from '@/services/orderService';

export const ProductCheckout = () => {
  const { items, getTotalPrice } = useCart();
  const [discountValidation, setDiscountValidation] = useState(null);
  
  const subtotal = getTotalPrice();
  const shippingCost = orderService.getShippingCost('SE', subtotal);
  
  const totals = orderService.calculateOrderTotals(
    items,
    shippingCost,
    discountValidation
  );
  
  // Use totals.total for final amount
  // ... rest of component
};
```

## 🔧 Environment Setup

Make sure your `.env` file has:

```bash
# Admin API Configuration
ADMIN_PORT=3002
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
VITE_SUPABASE_URL=https://iteixoxyyjhrskrkuuuc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🚀 Running Everything

Start all services:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Main API  
npm run dev:api

# Terminal 3: Admin API (for discount codes)
npm run dev:admin

# Or run all together:
npm run dev:full
```

## 📊 Available Discount Codes

Your system comes with these pre-configured codes:

- `WELCOME10` - 10% off orders over €50
- `SAVE20` - €20 off orders over €100  
- `VIP50` - 50% off (limited to 10 uses)
- `FREESHIP` - €15 off shipping
- `SUMMER25` - 25% off orders over €75 (100 uses)
- `BLACKFRIDAY` - €50 off orders over €200 (50 uses)

## 🔍 Testing

Test the integration:

1. Add items to cart
2. Go to checkout  
3. Enter discount code: `WELCOME10`
4. Verify discount is applied
5. Complete payment
6. Check admin dashboard for usage tracking

## 📈 Admin Management

Admins can:

- View all orders at `http://localhost:5173/admin/login`
- See discount code usage analytics
- Create/edit/delete discount codes
- Update order statuses
- Track revenue and savings

This integration provides a complete discount code system that works with both your AlphaPrint custom design flow and regular Silverback product checkout!

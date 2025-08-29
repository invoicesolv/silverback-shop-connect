export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
  customizations?: any;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface DiscountValidation {
  valid: boolean;
  code?: string;
  name?: string;
  description?: string;
  discount_type?: 'percentage' | 'fixed_amount';
  discount_value?: number;
  discount_amount?: number;
  original_amount?: number;
  final_amount?: number;
  savings?: number;
  error?: string;
}

export interface CreateOrderData {
  customer_info: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax?: number;
  discount_code?: string;
  payment_intent_id?: string;
  shipping_address: ShippingAddress;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  customer_info: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  original_total?: number;
  discount_code?: string;
  discount_amount?: number;
  discount_type?: string;
  payment_intent_id?: string;
  stripe_payment_status?: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
}

class OrderService {
  private baseURL: string;

  constructor() {
    this.baseURL = ''; // Always use relative URLs since we have proxy setup
  }

  async validateDiscountCode(code: string, orderAmount: number, customerEmail?: string): Promise<DiscountValidation> {
    try {
      const response = await fetch(`${this.baseURL}/api/validate-discount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code.toUpperCase(),
          orderAmount,
          customerEmail
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          valid: false,
          error: result.error || 'Failed to validate discount code'
        };
      }

      return result.validation;
    } catch (error: any) {
      console.error('Discount validation error:', error);
      return {
        valid: false,
        error: 'Network error while validating discount code'
      };
    }
  }

  async createOrder(orderData: CreateOrderData): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      // Calculate tax (21% VAT) if not provided
      const tax = orderData.tax || orderData.subtotal * 0.21;
      const total = (orderData.subtotal - (orderData.discount_code ? (orderData as any).discount_amount || 0 : 0)) + orderData.shipping + tax;
      
      const payload = {
        ...orderData,
        tax,
        total,
        customer_info: {
          name: orderData.customer_info.name,
          email: orderData.customer_info.email,
          phone: orderData.customer_info.phone,
          company: orderData.customer_info.company
        }
      };

      const response = await fetch(`${this.baseURL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to create order'
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error('Create order error:', error);
      return {
        success: false,
        error: 'Network error while creating order'
      };
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentIntentId?: string): Promise<{ success: boolean; data?: Order; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_status: paymentStatus,
          payment_intent_id: paymentIntentId
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to update payment status'
        };
      }

      return {
        success: true,
        data: result.data
      };
    } catch (error: any) {
      console.error('Update payment status error:', error);
      return {
        success: false,
        error: 'Network error while updating payment status'
      };
    }
  }

  // Calculate order totals with discount
  calculateOrderTotals(items: OrderItem[], shippingCost: number, discountValidation?: DiscountValidation) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.21; // 21% VAT
    
    let discountAmount = 0;
    if (discountValidation?.valid) {
      discountAmount = discountValidation.discount_amount || 0;
    }
    
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const total = discountedSubtotal + shippingCost + tax;
    
    return {
      subtotal,
      discountAmount,
      discountedSubtotal,
      shipping: shippingCost,
      tax,
      total,
      originalTotal: subtotal + shippingCost + tax
    };
  }

  // Format currency for display
  formatCurrency(amount: number, currency = 'EUR'): string {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency
    }).format(amount);
  }

  // Get shipping cost based on country
  getShippingCost(country: string, subtotal: number): number {
    // Free shipping on orders over €150
    if (subtotal >= 150) {
      return 0;
    }
    
    // Spain gets €10 shipping, all other Europe gets €15
    if (country.toLowerCase() === 'spain' || country.toLowerCase() === 'es') {
      return 10;
    }
    
    // Default Europe shipping
    return 15;
  }
}

export const orderService = new OrderService();
export default orderService;

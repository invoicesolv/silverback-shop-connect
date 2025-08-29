import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutForm from "@/components/CheckoutForm";
import { PaymentIntent } from "@/services/stripeService";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getShippingCost, getFinalTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('Europe');

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (result: any) => {
    setOrderDetails(result);
    setOrderComplete(true);
    setShowCheckout(false);
    clearCart();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Error is handled by the CheckoutForm component with toast
  };

  const preparePaymentData = (): PaymentIntent => {
    return {
      items: items.map(item => ({
        id: item.id.toString(),
        name: `${item.name}${item.size ? ` (${item.size})` : ''}${item.color ? ` - ${item.color}` : ''}`,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
    };
  };

  // Order completion view
  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4 text-gradient">Order Complete!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Thank you for your purchase. Your order has been successfully processed.
              </p>
              
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                  <div className="text-left space-y-2">
                    <p><strong>Order ID:</strong> {orderDetails.paymentIntent?.id}</p>
                    <p><strong>Amount:</strong> €{(orderDetails.paymentIntent?.amount / 100)?.toFixed(2)}</p>
                    <p><strong>Status:</strong> {orderDetails.paymentIntent?.status}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button className="bg-primary hover:bg-primary/90">
                    Continue Shopping
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setOrderComplete(false);
                    setOrderDetails(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Checkout view
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCheckout(false)}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
                <h1 className="text-4xl font-bold text-center text-gradient">Checkout</h1>
              </div>
              
              <CheckoutForm
                paymentData={preparePaymentData()}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-8 text-gradient">Your Cart</h1>
            <div className="max-w-md mx-auto">
              <p className="text-muted-foreground mb-8">Your cart is empty</p>
              <Link to="/products">
                <Button className="bg-primary hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center text-gradient">Your Cart</h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <Card key={`${item.id}-${item.size}-${item.color}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full md:w-32 h-32 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                        {item.size && (
                          <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                        )}
                        {item.color && (
                          <p className="text-sm text-muted-foreground">Color: {item.color}</p>
                        )}
                        <p className="text-xl font-bold text-price mt-2">€{Math.round(item.price)}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Cart Summary */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Subtotal:</span>
                    <span className="text-lg font-medium">€{getTotalPrice().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Shipping:</span>
                    <span className="text-lg font-medium">
                      {getShippingCost(selectedCountry) === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `€${getShippingCost(selectedCountry).toFixed(2)}`
                      )}
                    </span>
                  </div>
                  
                  {getTotalPrice() >= 150 && (
                    <div className="text-sm text-green-600 text-center p-2 bg-green-50 rounded">
                      🎉 Free shipping unlocked!
                    </div>
                  )}
                  
                  {getTotalPrice() < 150 && (
                    <div className="text-sm text-muted-foreground text-center p-2 bg-gray-50 rounded">
                      Add €{(150 - getTotalPrice()).toFixed(2)} more for free shipping
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold">Total:</span>
                      <span className="text-xl font-bold text-price">€{getFinalTotal(selectedCountry).toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">VAT 21% included</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <Button onClick={clearCart} variant="outline">
                      Clear Cart
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Link to="/products" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
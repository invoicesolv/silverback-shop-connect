import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlphaPrintHeader } from "@/components/AlphaPrintHeader";
import { AlphaPrintFooter } from "@/components/AlphaPrintFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package, CreditCard, Truck, ArrowLeft, ArrowRight } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { PaymentIntent } from "@/services/stripeService";

const AlphaPrintReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const { product, variants, quantity, designFiles, isCustomDesign, designPosition, designSize } = location.state || {};

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AlphaPrintHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Review Not Available</h1>
            <p className="text-xl text-muted-foreground mb-8">
              No order details found. Please start from the products page.
            </p>
            <Button onClick={() => navigate('/alphaprint/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Button>
          </div>
        </div>
        <AlphaPrintFooter />
      </div>
    );
  }

  const basePrice = product.basePrice;
  const variantPrices = Object.entries(variants || {}).reduce((total, [type, value]) => {
    const variant = product.variants.find((v: any) => v.type === type && v.value === value);
    return total + (variant?.priceModifier || 0);
  }, 0);
  const subtotal = (basePrice + variantPrices) * quantity;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over €50
  const total = subtotal + tax + shipping;

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = (result: any) => {
    setOrderDetails(result);
    setOrderComplete(true);
    setShowCheckout(false);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Error is handled by the CheckoutForm component with toast
  };

  const preparePaymentData = (): PaymentIntent => {
    const productName = `${product.name}${Object.entries(variants || {}).map(([type, value]) => ` (${type}: ${value})`).join('')}`;
    
    return {
      items: [{
        id: product.id.toString(),
        name: productName,
        price: total,
        quantity: 1, // Total already includes quantity
        image: product.images[0].url,
      }],
      // Include design details for admin notifications
      designDetails: {
        designFiles: designFiles || [],
        designPosition: designPosition,
        designSize: designSize,
        isCustomDesign: isCustomDesign || false,
        productVariants: variants,
        actualQuantity: quantity
      }
    };
  };

  // Order completion view
  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AlphaPrintHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-primary mb-4">Order Complete!</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Thank you for your custom order. Your design has been successfully processed.
            </p>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Order Details</h3>
                <div className="text-left space-y-2">
                  <p><strong>Order ID:</strong> {orderDetails.paymentIntent?.id}</p>
                  <p><strong>Amount:</strong> €{(orderDetails.paymentIntent?.amount / 100)?.toFixed(2)}</p>
                  <p><strong>Status:</strong> {orderDetails.paymentIntent?.status}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Production:</strong> 3-5 business days</p>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/alphaprint/products')} className="bg-primary hover:bg-primary/90">
                Create Another Design
              </Button>
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
        </main>

        <AlphaPrintFooter />
      </div>
    );
  }

  // Checkout view
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AlphaPrintHeader />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button 
                variant="outline" 
                onClick={() => setShowCheckout(false)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Review
              </Button>
              <h1 className="text-4xl font-bold text-primary text-center">Complete Your Order</h1>
            </div>
            
            <CheckoutForm
              paymentData={preparePaymentData()}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </main>

        <AlphaPrintFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AlphaPrintHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Review Your Order</h1>
          <p className="text-xl text-muted-foreground">
            Review your design and order details before placing your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                    <p className="text-muted-foreground mb-2">{product.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Quantity: {quantity}</Badge>
                      {Object.entries(variants || {}).map(([type, value]) => (
                        <Badge key={type} variant="outline">
                          {type}: {String(value)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Design Preview</CardTitle>
                <CardDescription>
                  {isCustomDesign ? "Custom design created with our design tool" : "Uploaded design files"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {designFiles && designFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src={product.images[0].url}
                        alt={`${product.name} with design`}
                        className="w-full h-full object-cover"
                      />
                      {designFiles[0].url && (
                        <div 
                          className="absolute"
                          style={{
                            width: designSize ? `${designSize * 2.5}px` : '60px',
                            height: designSize ? `${designSize * 2.5}px` : '60px',
                            left: designPosition?.x ? `${designPosition.x}%` : '50%',
                            top: designPosition?.y ? `${designPosition.y}%` : '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2
                          }}
                        >
                          <img
                            src={designFiles[0].url}
                            alt="Design preview"
                            className="w-full h-full object-contain"
                            style={{ 
                              background: 'transparent',
                              display: 'block'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Design Files:</h4>
                      {designFiles.map((file: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ))}
                      {designSize && designPosition && (
                        <div className="mt-2 p-2 bg-muted/20 rounded text-xs text-muted-foreground">
                          <p>Size: {Math.round((designSize / 24) * 100)}% • Position: {Math.round(designPosition.x)}, {Math.round(designPosition.y)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No design files uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Production & Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Production Time</p>
                    <p className="text-sm text-muted-foreground">3-5 business days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Shipping</p>
                    <p className="text-sm text-muted-foreground">
                      {shipping === 0 ? "Free shipping (order over €50)" : "Standard shipping: €9.99"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-sm text-muted-foreground">100% satisfaction guaranteed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>€{basePrice.toFixed(2)}</span>
                </div>
                {variantPrices > 0 && (
                  <div className="flex justify-between">
                    <span>Options:</span>
                    <span>+€{variantPrices.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Quantity ({quantity}):</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (8%):</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button 
                className="w-full h-12" 
                size="lg"
                onClick={handleProceedToCheckout}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Place Order
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Design
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Need Changes?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">
                  Want to modify your design or product options? Go back to make changes before placing your order.
                </p>
                <Button variant="ghost" size="sm" className="p-0 h-auto text-primary">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <AlphaPrintFooter />
    </div>
  );
};

export default AlphaPrintReview;
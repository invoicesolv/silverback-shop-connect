import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Package, Clock, MapPin } from "lucide-react";

export default function ShippingInfo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Shipping Information
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fast, reliable shipping to get your Silverback Treatment products to you quickly and safely.
            </p>
          </div>

          {/* Shipping Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Standard Shipping</h3>
                <div className="text-center mb-4">
                  <Badge variant="outline" className="border-primary/20">3-5 Business Days</Badge>
                </div>
                <p className="text-muted-foreground text-sm text-center mb-4">
                  Free shipping on orders over 500 SEK
                </p>
                <p className="font-semibold text-center">49 SEK</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-shadow border-primary/20">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Express Shipping</h3>
                <div className="text-center mb-4">
                  <Badge className="bg-primary">1-2 Business Days</Badge>
                </div>
                <p className="text-muted-foreground text-sm text-center mb-4">
                  Priority handling and fast delivery
                </p>
                <p className="font-semibold text-center">99 SEK</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">Next Day Delivery</h3>
                <div className="text-center mb-4">
                  <Badge variant="outline" className="border-warning text-warning">Next Business Day</Badge>
                </div>
                <p className="text-muted-foreground text-sm text-center mb-4">
                  Order by 2 PM for next day delivery
                </p>
                <p className="font-semibold text-center">149 SEK</p>
              </CardContent>
            </Card>
          </div>

          {/* Processing Time */}
          <Card className="bg-card border-border mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Processing & Handling</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Order Processing Time</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Standard orders: 1-2 business days</li>
                    <li>• Custom orders: 5-7 business days</li>
                    <li>• Pre-orders: As specified on product page</li>
                    <li>• Holiday periods: Extended processing times</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Fulfillment Schedule</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Orders placed Monday-Friday before 2 PM CET ship same day</li>
                    <li>• Orders placed after 2 PM CET ship next business day</li>
                    <li>• Weekend orders ship on Monday</li>
                    <li>• Swedish holidays affect processing times</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Shipping */}
          <Card className="bg-card border-border mb-12">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">International Shipping</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">European Union</h3>
                  <p className="text-muted-foreground text-sm mb-2">5-7 business days</p>
                  <p className="text-muted-foreground text-sm">Starting from 99 SEK</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">United Kingdom</h3>
                  <p className="text-muted-foreground text-sm mb-2">7-10 business days</p>
                  <p className="text-muted-foreground text-sm">Starting from 149 SEK</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Rest of World</h3>
                  <p className="text-muted-foreground text-sm mb-2">10-15 business days</p>
                  <p className="text-muted-foreground text-sm">Starting from 199 SEK</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> International orders may be subject to customs duties, 
                  taxes, and fees imposed by the destination country. These charges are the 
                  responsibility of the customer and are not included in the shipping cost.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tracking */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Order Tracking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">How to Track Your Order</h3>
                  <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                    <li>You'll receive a confirmation email when your order ships</li>
                    <li>The email contains your tracking number and carrier information</li>
                    <li>Click the tracking link or visit the carrier's website</li>
                    <li>Enter your tracking number to see real-time updates</li>
                  </ol>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Delivery Partners</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• PostNord (Sweden & Nordic countries)</li>
                    <li>• DHL Express (International)</li>
                    <li>• UPS (Express & International)</li>
                    <li>• Local couriers for same-day delivery</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
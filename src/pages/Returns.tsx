import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Package2, CreditCard, AlertCircle } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We want you to love your Silverback Treatment products. If you're not completely 
              satisfied, we're here to help with returns and exchanges.
            </p>
          </div>

          {/* Return Policy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">30-Day Returns</h3>
                <p className="text-muted-foreground">
                  Return unworn items within 30 days of delivery for a full refund
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Free Return Shipping</h3>
                <p className="text-muted-foreground">
                  We provide prepaid return labels for all domestic returns
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quick Refunds</h3>
                <p className="text-muted-foreground">
                  Refunds processed within 3-5 business days after we receive your return
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Return Process */}
          <Card className="bg-card border-border mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">How to Return an Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Start Your Return</h3>
                  <p className="text-muted-foreground text-sm">
                    Visit our returns portal or contact customer service to initiate your return
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Print Return Label</h3>
                  <p className="text-muted-foreground text-sm">
                    We'll email you a prepaid return shipping label within 24 hours
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Pack & Ship</h3>
                  <p className="text-muted-foreground text-sm">
                    Package your items securely and drop off at any authorized shipping location
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                    4
                  </div>
                  <h3 className="font-semibold mb-2">Get Your Refund</h3>
                  <p className="text-muted-foreground text-sm">
                    Receive your refund to the original payment method within 3-5 business days
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button className="bg-primary hover:bg-primary/90">
                  Start a Return
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Return Conditions */}
          <Card className="bg-card border-border mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Return Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4 text-green-600">✓ Eligible for Return</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Items in original condition with tags attached</li>
                    <li>• Unworn, unwashed, and undamaged items</li>
                    <li>• Items returned within 30 days of delivery</li>
                    <li>• Original packaging included when possible</li>
                    <li>• Items purchased at full price or on sale</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-red-600">✗ Not Eligible for Return</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Worn, washed, or damaged items</li>
                    <li>• Items without original tags</li>
                    <li>• Custom or personalized items</li>
                    <li>• Gift cards and promotional items</li>
                    <li>• Items returned after 30 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchanges */}
          <Card className="bg-card border-border mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Exchanges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Size Exchanges</h3>
                  <p className="text-muted-foreground mb-4">
                    Need a different size? We'll expedite your exchange so you get the right fit quickly.
                  </p>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Free size exchanges within 30 days</li>
                    <li>• New item ships before return is received</li>
                    <li>• Same style and color only</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Color/Style Exchanges</h3>
                  <p className="text-muted-foreground mb-4">
                    Want to try a different color or style? Exchange for any item of equal or lesser value.
                  </p>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li>• Exchange for equal or lesser value</li>
                    <li>• Price difference will be refunded</li>
                    <li>• Subject to availability</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* International Returns */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4">International Returns</h2>
                  <p className="text-muted-foreground mb-4">
                    International customers are responsible for return shipping costs. We recommend 
                    using a trackable shipping method.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Return Address</h3>
                      <div className="text-muted-foreground text-sm">
                        <p>Please contact our customer service team to receive the correct return address for your location.</p>
                        <p className="mt-2 font-medium">Email: info@silverbacktreatment.se</p>
                        <p>Phone: +34 600 013 960</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Important Notes</h3>
                      <ul className="space-y-1 text-muted-foreground text-sm">
                        <li>• Include original order number</li>
                        <li>• Use trackable shipping method</li>
                        <li>• Customer pays return shipping</li>
                        <li>• Customs forms may be required</li>
                      </ul>
                    </div>
                  </div>
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
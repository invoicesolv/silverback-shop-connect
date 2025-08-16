import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MessageCircle, Clock } from "lucide-react";

export default function CustomerService() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Customer Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you with any questions or concerns about your order, 
              our products, or your shopping experience.
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Phone Support</h3>
                <p className="text-muted-foreground mb-4">
                  Speak directly with our customer service team
                </p>
                <p className="font-semibold">+46 (0) 123 456 789</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">
                  Send us a detailed message and we'll respond promptly
                </p>
                <p className="font-semibold">support@silverbacktreatment.se</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-medium transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <Button className="bg-primary hover:bg-primary/90">Start Chat</Button>
              </CardContent>
            </Card>
          </div>

          {/* Support Hours */}
          <Card className="bg-card border-border mb-12">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Support Hours</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Service</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                  <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM CET</p>
                  <p className="text-muted-foreground">Sunday: Closed</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                  <p className="text-muted-foreground">Weekend: Limited availability</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How can I track my order?</h3>
                  <p className="text-muted-foreground text-sm">
                    You'll receive a tracking number via email once your order ships. 
                    Use this number on our website or the carrier's site to track your package.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What is your return policy?</h3>
                  <p className="text-muted-foreground text-sm">
                    We offer a 30-day return policy for unworn items in original condition. 
                    Visit our Returns page for detailed information and to start a return.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
                  <p className="text-muted-foreground text-sm">
                    Yes, we ship to most countries worldwide. Shipping costs and delivery 
                    times vary by destination. Check our Shipping Info page for details.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">How do I change my order?</h3>
                  <p className="text-muted-foreground text-sm">
                    Contact us immediately if you need to change your order. We can only 
                    modify orders that haven't been processed for shipping yet.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}